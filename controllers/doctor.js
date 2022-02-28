const Doctor = require('../models/Doctor')
const { Err } = require('../middleware/throw_error.js');
const getDoc = async(req, res) => {

    const doc_id = req.query.id;
    const doc = await Doctor.findById(doc_id);
    if (!doc) {
        throw Err("doctor not found", 404)
    }
    res.status(200).json({ doc })

}

const getAllDoc = async(req, res) => {
    const docs = await Doctor.find({});
    if (!docs) {
        throw Err("doctor not found", 404)
    }
    res.status(200).json({ docs })

}

const deleteDoc = async(req, res) => {
    const doc_id = req.query.id;
    const doc = await Doctor.deleteOne({ _id: doc_id });
    if (!doc.deletedCount) {
        throw Err("doctor not found", 404)
    }
    res.status(200).json({ "success": "true" })

}

module.exports = { getDoc, getAllDoc, deleteDoc };