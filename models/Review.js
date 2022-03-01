const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({

    drug_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Drug',
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    review: {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        required: true
    }





}, { timestamps: true })


module.exports = mongoose.model('Review', ReviewSchema);