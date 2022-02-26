const mongoose = require('mongoose');

const VitalSignsSchema = new mongoose.Schema({

    patient_id: {
        type: mongoose.Types.ObjectId, ref: 'Patient',
         required: true
    },
    condition: {
        type: String,
        required: true
    },
    temp: {
        type: mongoose.Types.Decimal128,
    },
    pulse: {
        type: Number,
    },

    respration: {
        type: Number,
    },
    pressure: {
        type: Number,
    },
    weight: {
        type: mongoose.Types.Decimal128,
        max: 250
    }




},
{timestamps: true}
)


module.exports = mongoose.model('VitalSigns', VitalSignsSchema);