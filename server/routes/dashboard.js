const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const Applicant = require('../models/Applicant');

// @route   GET /api/dashboard
router.get('/', async (req, res) => {
    try {
        const programs = await Program.find({});
        const applicants = await Applicant.find({});

        let totalIntake = 0;
        let totalFilled = 0;
        let totalAvailable = 0;

        let quotaStats = {
            'KCET': { total: 0, filled: 0 },
            'COMEDK': { total: 0, filled: 0 },
            'Management': { total: 0, filled: 0 },
            'Supernumerary': { total: 0, filled: 0 }
        };

        programs.forEach(prog => {
            totalIntake += prog.totalIntake;
            prog.quotas.forEach(q => {
                if (quotaStats[q.quotaName]) {
                    quotaStats[q.quotaName].total += q.assignedSeats;
                    quotaStats[q.quotaName].filled += q.filledSeats;
                    totalFilled += q.filledSeats;
                }
            });
        });
        totalAvailable = totalIntake - totalFilled;

        const pendingFees = applicants.filter(a => a.feeStatus === 'Pending' && a.admissionStatus === 'Allocated').length;
        const pendingDocs = applicants.filter(a => a.documentStatus !== 'Verified').length;

        // Breakdown per program
        const programWise = programs.map(p => {
            const sumFilled = p.quotas.reduce((acc, q) => acc + q.filledSeats, 0);
            return {
                id: p._id,
                name: p.programName,
                intake: p.totalIntake,
                filled: sumFilled,
                remaining: p.totalIntake - sumFilled,
                quotas: p.quotas
            };
        });

        res.json({
            stats: { totalIntake, totalFilled, totalAvailable, pendingFees, pendingDocs },
            quotaStats,
            programWise
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
