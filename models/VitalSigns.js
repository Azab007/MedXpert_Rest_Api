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
        min: 24,
        max: 37
    },
    pulse: {
        type: Number,
        min: 27,
        max: 220
    },

    respration: {
        type: Number,
        min: 1,
        max: 80
    },
    systolicPressure: {
        type: Number,
        min: 0,
        max: 370
    },
    diastolicPressure: {
        type: Number,
        min: 0,
        max: 370
    },
    weight: {
        type: Double,
        max: 250
    },

    sugar: {
        type: Number,
        min: 7,
        max: 2656
    },
    oxegen: {
        type: Number,
        min: 0,
        max: 100
    }

    // problems: [{
    //     type: String,
    //     enum: ["temp", "pulse", "respration", "pressure", "weight"]
    // }]




}, { timestamps: true })


module.exports = mongoose.model('VitalSigns', VitalSignsSchema);