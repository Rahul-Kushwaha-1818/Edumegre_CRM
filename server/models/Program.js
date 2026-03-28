const mongoose = require('mongoose');

const QuotaSchema = new mongoose.Schema({
    quotaName: {
        type: String,
        required: true,
        enum: ['KCET', 'COMEDK', 'Management', 'Supernumerary']
    },
    assignedSeats: {
        type: Number,
        required: true,
        min: 0
    },
    filledSeats: {
        type: Number,
        default: 0
    }
});

const ProgramSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    campus: { type: String, required: true },
    department: { type: String, required: true },
    programName: { type: String, required: true }, // e.g., "CSE", "ECE"
    programCode: { type: String, required: true }, // e.g., "CSE" (Used to generate admission number)
    academicYear: { type: String, required: true },
    courseType: { type: String, enum: ['UG', 'PG'], required: true },
    entryType: { type: String, enum: ['Regular', 'Lateral'], required: true },
    admissionMode: { type: String, enum: ['Government', 'Management'], required: true },
    totalIntake: { type: Number, required: true, min: 1 },
    quotas: [QuotaSchema]
}, { timestamps: true });

module.exports = mongoose.model('Program', ProgramSchema);
