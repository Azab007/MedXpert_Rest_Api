const mongoose = require('mongoose');

const VerificationToken = new mongoose.Schema({
    Token: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    isPatient: {
        type: Boolean,
        required: true
    }

}, { timestamps: true })

VerificationToken.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('VerificationToken', VerificationToken);