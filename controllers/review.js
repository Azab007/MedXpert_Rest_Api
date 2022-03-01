const Review = require('../models/Review')
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const addReview = async(req, res) => {
    const {
        drug_id,
        user_id,
        review,
        rating
    } = req.body
    const rev = await Review.create({ drug_id, user_id, review, rating })
    if (!rev) {
        throw new BadRequestError('failed to add review')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": rev })
}

const updateReview = async(req, res) => {
    const { rev_id, review, rating } = req.body
    const rev = await Review.findByIdAndUpdate(rev_id, {
        review,
        rating
    }, { runValidators: true, new: true })
    if (!rev) {
        throw new NotFoundError('review not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": rev })
}

const removeReview = async(req, res) => {
    const { rev_id } = req.body
    const rev = await Review.findByIdAndDelete(rev_id)
    res.status(200).json({ rev })
}

const getReview = async(req, res) => {
    const { drug_id } = req.body
    const rev = await Review.find({ drug_id })
    if (!rev) {
        throw new NotFoundError('no reviews yet')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": rev })
}


module.exports = {
    addReview,
    updateReview,
    removeReview,
    getReview
}