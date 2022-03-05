const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({

    drugs: [

        {
            drug_id: {
                type: mongoose.Types.ObjectId,
                ref: 'Drug',
                required: true,
            },

            dose: {
                type: mongoose.Types.Decimal128,
                required: true
            },
            start_date: {
                type: Date,
                required: true,
            },
            end_date: {
                type: Date,
                required: true,
            },
            _id: false,
        },

    ],
    patient_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },

    currentlyTaken: {
        type: Boolean,
        default: true
    },




}, { timestamps: true })


module.exports = mongoose.model('Medication', MedicationSchema);