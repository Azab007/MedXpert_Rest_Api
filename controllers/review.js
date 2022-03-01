const Review = require('../models/Review')
const { Err } = require('../middleware/throw_error')

const add = async(req, res) => {
    const { drug_id, user_id, review, rating } = req.body
    const rev = await Review.create({ drug_id, user_id, review, rating })
    res.status(200).json(rev)
}

const update = async(req, res) => {
    const { rev_id, review, rating } = req.body
    const rev = await Review.findByIdAndUpdate(rev_id, {review, rating }, { runValidators: true, new: true })
    res.status(200).json({ rev })
}

const remove = async(req, res) => {
    const { rev_id } = req.body
    const rev = await Review.findByIdAndDelete(rev_id)
    res.status(200).json({ rev })
}

const get = async(req, res) => {
    const drug_id = req.params.drug_id
    const rev = await Review.find({ drug_id })
    res.status(200).json({ rev })
}


module.exports = {
    add,
    update,
    remove,
    get
}