const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true
    },

    drugUniqueId: {
        type: String,
        required: true
    },
    drugName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        expires: 1
    }

}, { timestamps: true })
notificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 10 });

module.exports = mongoose.model('Notification', notificationSchema);