const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
    Token: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'pharma_inc'],
        required: true
    }

}, { timestamps: true })

passwordResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('passwordResetToken', passwordResetTokenSchema);