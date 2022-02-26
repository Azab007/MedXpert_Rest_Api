const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({

    drug_id: {
        type: mongoose.Types.ObjectId, ref: 'Drug',
         required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId, ref: 'Patient',
        required: true
    },
    review: {
        type: String,
    },
    rating: {
        type: mongoose.Types.Decimal128,
        max: 10,
        required: true
    },

    useful_counts: {
        type: Number,
        default: 0
    }





},
{timestamps: true}
)


module.exports = mongoose.model('Drug', ReviewSchema);