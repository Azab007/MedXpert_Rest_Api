const Patient = require('../models/Patient')
const Invitation = require('../models/invitations')
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const { default: axios } = require('axios');
const { parseString } = require("xml2js");



const getPatient = async(req, res) => {
    const id = req.user.userId;
    const patient = await Patient.findById(id);
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

const getArticles = async(req, res) => {
    const id = req.user.userId;
    const patient = await Patient.findById(id);
    let chronics = [];
    if (patient.chronics.length) {
        chronics = patient.chronics.map(chronic => {
            return chronic.chronic_name
        })
    }


    const respnse = await axios.get(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${chronics.join("[MeSH Terms] AND ")}&retmax=100 `)
    parseString(respnse.data, function(err, result) {
        const Ids = result.eSearchResult.IdList[0].Id ? result.eSearchResult.IdList[0].Id : []
        const Links = Ids.map((id) => {
            return `https://pubmed.ncbi.nlm.nih.gov/${id}/`
        })

        res.status(StatusCodes.OK).json({ "data": Links, "msg": "success" })
    });

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
    getArticles
}