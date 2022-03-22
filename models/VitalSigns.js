const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');
const VitalSignsSchema = new mongoose.Schema({

    patient_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    temp: {
        type: Double,
    },
    pulse: {
        type: Number,
    },

    respration: {
        type: Number,
    },
    pressure: {
        type: String,
    },
    weight: {
        type: Double,
        max: 250
    },

    problems: [{
        type: String,
        enum: ["temp", "pulse", "respration", "pressure", "weight"]
    }]




}, { timestamps: true })


module.exports = mongoose.model('VitalSigns', VitalSignsSchema);