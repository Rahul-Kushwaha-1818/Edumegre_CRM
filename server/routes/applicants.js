const express = require('express');
const router = express.Router();
const Applicant = require('../models/Applicant');
const Program = require('../models/Program');
const Counter = require('../models/Counter');
const mongoose = require('mongoose');

// Generate unique ID utility
async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate(
       { _id: sequenceName },
       { $inc: { seq: 1 } },
       { new: true, upsert: true }
    );
    return sequenceDocument.seq;
}

// @route   POST /api/applicants
router.post('/', async (req, res) => {
    try {
        const applicantInfo = req.body;
        
        let newApp = new Applicant({
            ...applicantInfo
        });
        await newApp.save();
        
        // Populate specific fields to return immediately
        newApp = await newApp.populate('programApplied');
        res.status(201).json(newApp);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
});

// @route   GET /api/applicants
router.get('/', async (req, res) => {
    try {
        const applicants = await Applicant.find({}).populate('programApplied').sort({ createdAt: -1 });
        res.json(applicants);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/applicants/:id (Update generic info like fees/docs)
router.put('/:id', async (req, res) => {
    try {
        const { documentStatus, feeStatus } = req.body;
        const updatedApp = await Applicant.findByIdAndUpdate(
            req.params.id, 
            { $set: { documentStatus, feeStatus } }, 
            { new: true }
        ).populate('programApplied');
        res.json(updatedApp);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/applicants/:id/allocate
// @desc    Attempt to allocate a seat under quota matching
router.put('/:id/allocate', async (req, res) => {
    // Start session for atomic transaction if Replica Set, else fallback to standard
    try {
        const applicant = await Applicant.findById(req.params.id).populate('programApplied');
        if (!applicant) return res.status(404).json({ msg: 'Applicant not found' });
        
        if (applicant.admissionStatus !== 'Pending') {
            return res.status(400).json({ msg: 'Seat is already allocated or confirmed' });
        }

        const program = await Program.findById(applicant.programApplied._id);
        const quotaDetails = program.quotas.find(q => q.quotaName === applicant.quotaType);
        
        if (!quotaDetails) return res.status(400).json({ msg: 'Invalid quota configuration' });
        
        if (quotaDetails.filledSeats >= quotaDetails.assignedSeats) {
            return res.status(400).json({ msg: `Allocation Failed: ${applicant.quotaType} quota is full (${quotaDetails.assignedSeats}/${quotaDetails.assignedSeats})` });
        }

        // Atomically increment quota filled seats directly using $elemMatch
        const updateResult = await Program.updateOne(
            { 
                _id: program._id, 
                quotas: { $elemMatch: { quotaName: applicant.quotaType, filledSeats: { $lt: quotaDetails.assignedSeats } } } 
            },
            { $inc: { 'quotas.$.filledSeats': 1 } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ msg: 'Race condition: Quota just became full!' });
        }

        applicant.admissionStatus = 'Allocated';
        await applicant.save();

        res.json(applicant);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/applicants/:id/confirm
// @desc    Generate AdmissionNumber if conditions are met
router.put('/:id/confirm', async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id).populate('programApplied');
        if (!applicant) return res.status(404).json({ msg: 'Applicant not found' });

        if (applicant.admissionStatus !== 'Allocated') {
            return res.status(400).json({ msg: 'Seat must be allocated before confirming!' });
        }
        if (applicant.feeStatus !== 'Paid') {
            return res.status(400).json({ msg: 'Fee MUST be Paid before admission can be confirmed.' });
        }
        if (applicant.documentStatus !== 'Verified') {
            return res.status(400).json({ msg: 'Documents MUST be Verified before confirming.' });
        }

        // Generate Admission Number: INST/2026/UG/CSE/KCET/0001
        const p = applicant.programApplied;
        const sequenceId = `INST_${p.academicYear}_${p.courseType}_${p.programCode}_${applicant.quotaType}`;
        const nextSeq = await getNextSequenceValue(sequenceId);
        
        const paddedSeq = String(nextSeq).padStart(4, '0');
        const admissionNumber = `INST/${p.academicYear}/${p.courseType}/${p.programCode}/${applicant.quotaType.toUpperCase()}/${paddedSeq}`;

        applicant.admissionNumber = admissionNumber;
        applicant.admissionStatus = 'Confirmed';
        await applicant.save();

        res.json(applicant);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
