const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');


const MedicationSchema = new mongoose.Schema({

    drugs: [

        {
            drug_id: {
                type: mongoose.Types.ObjectId,
                ref: 'Drug',
                required: true,
            },
            drug_name: {
                type: String,
                required: true,
            },

            dose: {
                type: Double,
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
            currentlyTaken: {
                type: Boolean,
                default: true
            }
            // _id: false,
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
    },
    name: {
        type: String,
        //required: true
    }

}, { timestamps: true })


module.exports = mongoose.model('Medication', MedicationSchema);