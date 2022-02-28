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

const addSpecialization = async(req, res) => {
    const { id, specialization } = req.body;
    console.log(req.body)
    const doc = await Doctor.findByIdAndUpdate(id, { $push: { specialization } }, { runValidators: true, new: true })
    if (!doc) {
        throw Err("doctor not found", 404)
    }
    res.status(200).json({ doc });
}

const deleteSpecialization = async(req, res) => {
    const { id, specialization } = req.body
    const doc = await Doctor.findByIdAndUpdate(id, { $pull: { specialization } }, { runValidators: true, new: true })
    if (!doc) {
        throw Err("doctor not found", 404)
    }
    res.status(200).json({ doc });
}

const update = async(req, res) => {
    const { id, username, residency, bio } = req.body
    const doc = await Doctor.findByIdAndUpdate(id, { username, residency, bio }, { runValidators: true, new: true })
    res.status(200).json({ doc });
}



module.exports = {
    getDoc,
    getAllDoc,
    deleteDoc,
    addSpecialization,
    deleteSpecialization,
    update
};