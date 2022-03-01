const Patient = require('../models/Patient')
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const getPatient = async(req, res) => {
    const { id } = req.body;
    const patient = await Patient.findById(id);
    if (!Patient) {
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
    const { patient_id } = req.body;
    const patient = await Patient.deleteOne({ _id: patient_id });
    if (!patient) {
        throw new NotFoundError('patient not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success" })

}

const updatePatient = async(req, res) => {
    const {
        id,
        username,
        birthDate,
        gender,
        weight,
        residency
    } = req.body

    if (weight && weight <= 0) {
        throw new BadRequestError('invalid weight')
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
    console.log(req.body)
    const {
        id,
        type,
        followers,
        clinicians,
        chronics
    } = req.body
    const patient = await Patient.findByIdAndUpdate(id, {
        $addToSet: {
            type,
            followers,
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
    const {
        id,
        type,
        followers,
        clinicians,
        chronics
    } = req.body
    const patient = await Patient.findByIdAndUpdate(id, {
        $pull: {
            type,
            followers,
            clinicians,
            chronics
        }
    }, { runValidators: true, new: true })
    if (!patient) {
        throw new NotFoundError('patient not found')
    }
    res.status(StatusCodes.OK).json({ "msg": "success", "data": patient })
}





module.exports = {
    getPatient,
    getAllpatients,
    updatePatient,
    addToList,
    deleteFromList,
    deletePatient
}