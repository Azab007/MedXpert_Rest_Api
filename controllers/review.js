const Review = require('../models/Review')
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const addReview = async(req, res) => {
    const user_id = req.user.userId
    const {
        drug_id,
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
    const user_id = req.user.userId
    const rev_id = req.query.id
    const { review, rating } = req.body
    const revcheck = await Review.findById(rev_id)
    if (!revcheck) {
        throw new NotFoundError('review not found')
    }
    if (revcheck.user_id.toString() !== user_id) {
        throw new UnauthorizedError('not allowed')
    }
    const rev = await Review.findByIdAndUpdate(rev_id, {
        review,
        rating
    }, { runValidators: true, new: true })
    res.status(StatusCodes.OK).json({ "msg": "success", "data": rev })
}

const removeReview = async(req, res) => {
    const user_id = req.user.userId
    const rev_id = req.query.id
    const revcheck = await Review.findById(rev_id)
    if (!revcheck) {
        throw new NotFoundError('review not found')
    }
    if (revcheck.user_id !== user_id) {
        throw new UnauthorizedError('not allowed')
    }
    const rev = await Review.findByIdAndDelete(rev_id)
    res.status(StatusCodes.OK).json({ "msg": "success", "data": rev })
}

const getReview = async(req, res) => {
    const drug_id = req.query.id
    const rev = await Review.find({ drug_id })
    if (!rev.length) {
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