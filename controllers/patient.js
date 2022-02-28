const Patient = require('../models/Patient')


const getPatient = async(req, res) => {

    const id = req.query.id;
    const patient = await Patient.findById(id);
    if (!Patient) {
        throw Err("patient not found", 404)
    }
    res.status(200).json({ patient })

}

const getAllpatients = async(req, res) => {
    const patients = await Patient.find({});
    if (!patients) {
        throw Err("patient not found", 404)
    }
    res.status(200).json({ patients })

}

const update = async(req, res) => {
    const { id, username, birthDate, gender, weight, residency } = req.body
    const patient = await Patient.findByIdAndUpdate(id, { username, birthDate, weight, gender, residency }, { runValidators: true, new: true })
    res.status(200).json({ patient })
}
const add = async(req, res) => {
    console.log(req.body)
    const { id, type, followers, clinicians, chronics } = req.body
    const patient = await Patient.findByIdAndUpdate(id, { $push: { type, followers, clinicians, chronics } }, { runValidators: true, new: true })
    res.status(200).json(patient)
}



module.exports = {
    getPatient,
    getAllpatients,
    update,
    add
}