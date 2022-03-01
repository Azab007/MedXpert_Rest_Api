const Patient = require('../models/Patient')
const { NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const getPatient = async(req, res) => {

    const id = req.query.id;
    const patient = await Patient.findById(id);
    if (!Patient) {
        throw new NotFoundError('patient not found')
    }
    res.status(StatusCodes.OK).json({ patient })
}

const getAllpatients = async(req, res) => {
    const patients = await Patient.find({});
    if (!patients) {
        throw Err("patient not found", 404)
    }
    res.status(200).json({ patients })

}

const deletePatient = async(req, res) => {
    const patient_id = req.query.id;
    const patient = await Patient.deleteOne({ _id: patient_id });
    if (!patient.deletedCount) {
        throw Err("patient not found", 404)
    }
    res.status(200).json({ "success": "true" })

}

const updatePatient = async(req, res) => {
    const { id, username, birthDate, gender, weight, residency } = req.body
    const patient = await Patient.findByIdAndUpdate(id, { username, birthDate, weight, gender, residency }, { runValidators: true, new: true })
    res.status(200).json({ patient })
}
const addToList = async(req, res) => {
    console.log(req.body)
    const { id, type, followers, clinicians, chronics } = req.body
    const patient = await Patient.findByIdAndUpdate(id, { $addToSet: { type, followers, clinicians, chronics } }, { runValidators: true, new: true })
    res.status(200).json(patient)
}

const deleteFromList = async(req, res) => {
    const { id, type, followers, clinicians, chronics } = req.body
    const patient = await Patient.findByIdAndUpdate(id, { $pull: { type, followers, clinicians, chronics } }, { runValidators: true, new: true })
    res.status(200).json(patient)
}





module.exports = {
    getPatient,
    getAllpatients,
    updatePatient,
    addToList,
    deleteFromList,
    deletePatient
}