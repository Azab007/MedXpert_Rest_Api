const mongoose = require('mongoose');

const InvitaionsSchema = new mongoose.Schema({
    invitaionNumber: {
        type: String,
        required: true,
        unique: true
    },
    patient_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true
    }

}, { timestamps: true })


module.exports = mongoose.model('Invitations', InvitaionsSchema);