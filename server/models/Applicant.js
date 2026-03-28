const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
    // Basic Details (Max 15 Fields)
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    category: { type: String, enum: ['GM', 'SC', 'ST', 'OBC', 'Other'], required: true },
    entryType: { type: String, enum: ['Regular', 'Lateral'], required: true },
    marks: { type: Number, required: true }, // qualifying exam marks percentage

    // Application specifics
    programApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    quotaType: { type: String, enum: ['KCET', 'COMEDK', 'Management', 'Supernumerary'], required: true },
    allotmentNumber: { type: String }, // For Gov Flow (KCET/COMEDK)

    // Status Tracking
    documentStatus: { type: String, enum: ['Pending', 'Submitted', 'Verified'], default: 'Pending' },
    feeStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    admissionStatus: { type: String, enum: ['Pending', 'Allocated', 'Confirmed'], default: 'Pending' },

    // Final outcome
    admissionNumber: { type: String, sparse: true, unique: true } // Generated uniquely once Confirmed
}, { timestamps: true });

module.exports = mongoose.model('Applicant', ApplicantSchema);
