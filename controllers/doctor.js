const Doctor = require('../models/Doctor')
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const getDoc = async(req, res) => {

    const { doc_id } = req.body;
    const doc = await Doctor.findById(doc_id);
    if (!doc) {
        throw new NotFoundError('doctor not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": doc })

}

const getAllDoc = async(req, res) => {
    const docs = await Doctor.find({});
    if (!docs) {
        throw new NotFoundError('no doctors in database')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": docs })

}

const deleteDoc = async(req, res) => {
    const { doc_id } = req.body;
    const doc = await Doctor.findByIdAndDelete(doc_id);
    if (!doc) {
        throw new NotFoundError('doctor not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": doc })

}

const addSpecialization = async(req, res) => {
    const { id, specialization } = req.body;
    console.log(req.body)
    const doc = await Doctor.findByIdAndUpdate(id, {
        $addToSet: { specialization }
    }, { runValidators: true, new: true })

    if (!doc) {
        throw new NotFoundError('doctor not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": doc })
}

const deleteSpecialization = async(req, res) => {
    const { id, specialization } = req.body
    const doc = await Doctor.findByIdAndUpdate(id, {
        $pull: { specialization }
    }, { runValidators: true, new: true })
    if (!doc) {
        throw Err("doctor not found", 404)
    }
    res.status(200).json({ doc });
}

const updateDoc = async(req, res) => {
    const { id, username, residency, bio } = req.body
    const doc = await Doctor.findByIdAndUpdate(id, {
        username,
        residency,
        bio
    }, { runValidators: true, new: true })
    res.status(200).json({ doc });
}



module.exports = {
    getDoc,
    getAllDoc,
    deleteDoc,
    addSpecialization,
    deleteSpecialization,
    updateDoc
};