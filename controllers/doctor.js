const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient')
const Invitation = require('../models/invitations')
const { NotFoundError, UnauthorizedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');

const getDoc = async(req, res) => {

    const doc_id = req.user.userId;
    const doc = await Doctor.findById(doc_id);
    if (!doc) {
        throw new NotFoundError('doctor not found')
    }
    delete doc._doc.password
    res.status(StatusCodes.OK).json({ "msg": "success", "data": doc })

}

const getAllDoc = async(req, res) => {
    const docs = await Doctor.find({});
    if (!docs.length) {
        throw new NotFoundError('no doctors in database')
    }
    const ret = docs.map(doc => { delete doc._doc.password; return doc })
    res.status(StatusCodes.OK).json({ "msg": "success", "data": ret })

}

const deleteDoc = async(req, res) => {
    const doc_id = req.user.userId;
    const doc = await Doctor.findByIdAndDelete(doc_id);
    if (!doc) {
        throw new NotFoundError('doctor not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": doc })

}

const addSpecialization = async(req, res) => {
    const id = req.user.userId;
    const { specialization } = req.body;
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
    const id = req.user.userId;
    const { specialization } = req.body
    const doc = await Doctor.findByIdAndUpdate(id, {
        $pull: { specialization }
    }, { runValidators: true, new: true })
    if (!doc) {
        throw Err("doctor not found", 404)
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": doc })
}

const updateDoc = async(req, res) => {
    const id = req.user.userId;
    const { username, residency, bio, specialization } = req.body
    const doc = await Doctor.findByIdAndUpdate(id, {
        username,
        residency,
        bio,
        specialization
    }, { runValidators: true, new: true })
    if (!doc) {
        throw new NotFoundError('doctor not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": doc })

}


const useInvitation = async(req, res) => {
    const invitaionNumber = req.query.code
    const myId = req.user.userId
    const invitation = await Invitation.findOneAndDelete({ invitaionNumber })
    if (!invitation) {
        throw new NotFoundError("this invitaions has expired, pls create a new one");
    }
    const followingId = invitation.patient_id;
    console.log(invitation.patient_id)

    await Doctor.findByIdAndUpdate(myId, {
        $addToSet: {
            followings: { patient_id: followingId }
        }
    }, { runValidators: true, new: true, })

    await Patient.findByIdAndUpdate(followingId, {
        $addToSet: {
            clinicians: { doctor: myId }
        }
    }, { runValidators: true, new: true })

    res.status(StatusCodes.OK).json({ "msg": "success" })

}




module.exports = {
    getDoc,
    getAllDoc,
    deleteDoc,
    addSpecialization,
    deleteSpecialization,
    updateDoc,
    useInvitation
};