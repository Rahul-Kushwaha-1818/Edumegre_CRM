const express = require('express');
const router = express.Router();
const Program = require('../models/Program');

// @route   POST /api/programs
// @desc    Create a new program with assigned quotas & intake
router.post('/', async (req, res) => {
    try {
        const { institution, campus, department, programName, programCode, academicYear, courseType, entryType, admissionMode, totalIntake, quotas } = req.body;
        
        // Validation: Sum of defined standard quotas must match totalIntake
        const totalAssignedSeats = quotas.filter(q => q.quotaName !== 'Supernumerary').reduce((sum, quota) => sum + parseInt(quota.assignedSeats || 0), 0);
        if (totalAssignedSeats !== parseInt(totalIntake)) {
            return res.status(400).json({ msg: 'Base quota assigned seats must exactly equal total intake.' });
        }

        const newProgram = new Program({
            institution, campus, department, programName, programCode, academicYear, courseType, entryType, admissionMode, totalIntake, quotas
        });
        
        await newProgram.save();
        res.status(201).json(newProgram);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/programs
// @desc    Fetch all programs
router.get('/', async (req, res) => {
    try {
        const programs = await Program.find({});
        res.json(programs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
