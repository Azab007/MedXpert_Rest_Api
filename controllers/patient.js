const Patient = require('../models/Patient')
const Invitation = require('../models/invitations')
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const { default: axios } = require('axios');
const { parseString } = require("xml2js");
const Doctor = require('../models/Doctor');



const getPatient = async(req, res) => {
    const id = req.user.userId;
    const patient = await Patient.findById(id).populate('followers', "_id username email gender").populate('followings', "_id username email gender").populate('clinicians.doctor', "_id username email gender specialization");
    if (!patient) {
        throw new NotFoundError('patient not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": patient })
}

const getAllpatients = async(req, res) => {
    const patients = await Patient.find({});
    if (!patients) {
        throw new NotFoundError('no patient in database')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": patients })

}

const deletePatient = async(req, res) => {
    const { patient_id } = req.user.userId;
    const patient = await Patient.findByIdAndDelete(patient_id);
    if (!patient) {
        throw new NotFoundError('patient not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success" })

}

const updatePatient = async(req, res) => {
    const id = req.user.userId
    const {
        username,
        birthDate,
        gender,
        weight,
        email,
        residency
    } = req.body

    if (weight && weight <= 0) {
        throw new BadRequestError('invalid weight')
    }
    const bd = new Date(birthDate)
    const lowerDate = new Date("1-1-1900")

    if (bd > Date.now() || bd < lowerDate) {
        throw new BadRequestError('invalid birth date')
    }
    const patient = await Patient.findByIdAndUpdate(id, {
        username,
        birthDate,
        weight,
        gender,
        email,
        residency
    }, { runValidators: true, new: true })
    if (!patient) {
        throw new NotFoundError('patient not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": patient })
}

const addToList = async(req, res) => {
    let id;
    if (req.user.role === 'patient') {
        id = req.user.userId
    } else {
        id = req.query.id
    }
    const {
        type,
        clinicians,
        chronics
    } = req.body
    const patient = await Patient.findByIdAndUpdate(id, {
        $addToSet: {
            type,
            clinicians,
            chronics
        }
    }, { runValidators: true, new: true })
    if (!patient) {
        throw new NotFoundError('patient not found')
    }

    res.status(StatusCodes.OK).json({ "msg": "success", "data": patient })
}



const deleteFromList = async(req, res) => {
    let id;
    if (req.user.role === 'patient') {
        id = req.user.userId
    } else {
        id = req.query.id
    }
    const {
        type,
        followers,
        clinicians: { doctor_id = null } = { doctor_id: null },
        chronics: { chronic_name = "null" } = { chronic_name: "null" }
    } = req.body
    const patient = await Patient.findByIdAndUpdate(id, {
        $pull: {
            type,
            followers,
            clinicians: { "doctor_id": doctor_id },
            chronics: { "chronic_name": chronic_name }
        }
    }, { runValidators: true, new: true })
    if (!patient) {
        throw new NotFoundError('patient not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": patient })
}


const createInvitation = async(req, res) => {
    const invitaionNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const patient_id = req.user.userId
    await Invitation.deleteMany({ patient_id });
    const data = new Invitation({ invitaionNumber, patient_id })
    await data.save()
    res.status(StatusCodes.OK).json({ "msg": "success", "data": data })

}

const useInvitation = async(req, res) => {
    const invitaionNumber = req.query.code
    const myId = req.user.userId
    const invitation = await Invitation.findOneAndDelete({ invitaionNumber })
    if (!invitation) {
        throw new NotFoundError("this invitaions has expired, pls create a new one");
    }
    const followingId = invitation.patient_id
    if (followingId === myId) {
        throw new BadRequestError("You cannot use your own invitation");
    }
    // let diff = new Date() - new Date(invitation.createdAt);
    // if (diff > 1000 * 60 * 5) { // 5 minutes
    //     throw new BadRequestError("out of date")
    // }
    await Patient.findByIdAndUpdate(myId, {
        $addToSet: {
            followings: followingId
        }
    }, { runValidators: true, new: true })

    await Patient.findByIdAndUpdate(followingId, {
        $addToSet: {
            followers: myId
        }
    }, { runValidators: true, new: true })

    res.status(StatusCodes.OK).json({ "msg": "success" })

}


const deleteFollowerFromPatient = async(req, res) => {
    const patientId = req.query.id
    const myId = req.user.userId
    await Patient.findByIdAndUpdate(myId, {
        $pull: {
            followers: patientId
        }
    }, { runValidators: true, new: true })

    await Patient.findByIdAndUpdate(patientId, {
        $pull: {
            followings: myId

        }
    }, { runValidators: true, new: true })
    return res.status(StatusCodes.OK).json({ "msg": "success" })

}


const deleteFollowingFromPatient = async(req, res) => {
    const patientId = req.query.id
    const myId = req.user.userId
    await Patient.findByIdAndUpdate(myId, {
        $pull: {
            followings: patientId
        }
    }, { runValidators: true, new: true })

    await Patient.findByIdAndUpdate(patientId, {
        $pull: {
            followers: myId

        }
    }, { runValidators: true, new: true })
    return res.status(StatusCodes.OK).json({ "msg": "success" })

}

const deleteDoctorFromPatient = async(req, res) => {
    const doctorId = req.query.id
    const myId = req.user.userId
    await Patient.findByIdAndUpdate(myId, {
        $pull: {
            clinicians: { doctor: doctorId }
        }
    }, { runValidators: true, new: true })

    await Doctor.findByIdAndUpdate(doctorId, {
        $pull: {
            followings: { patient_id: myId }

        }
    }, { runValidators: true, new: true })
    return res.status(StatusCodes.OK).json({ "msg": "success" })

}


const getArticles = async(req, res) => {
    const keyword = req.query.keyword
    const url = `http://api.mediastack.com/v1/news?access_key=974d300743a97d06312c34fd80d5cbcc&languages=en,ar&keywords=${keyword.trim()}&limit=50&categories=science,health`

    const respnse = await axios.get(url)
    res.status(StatusCodes.OK).json(respnse.data)

}



module.exports = {
    getPatient,
    getAllpatients,
    updatePatient,
    addToList,
    deleteFromList,
    deletePatient,
    createInvitation,
    useInvitation,
    getArticles,
    deleteDoctorFromPatient,
    deleteFollowerFromPatient,
    deleteFollowingFromPatient
}