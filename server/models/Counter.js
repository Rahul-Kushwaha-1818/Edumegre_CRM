const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Using string for sequence tracker (e.g. "INST_2026_UG_CSE_KCET")
    seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', CounterSchema);
