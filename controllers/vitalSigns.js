const VitalSign = require('../models/VitalSigns.js')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, BadRequestError } = require('../errors');

const createVitalSign = async(req, res) => {
    const patientId = req.user.userId;
    const { _id, patient_id, ...others } = req.body;
    try {
        const newVitalSign = new VitalSign({
            ...others,
            patient_id: patientId
        });

        await newVitalSign.save();
        res.status(StatusCodes.CREATED).json({ "data": newVitalSign, "msg": "vital sign created successfully" });

    } catch (error) {
        throw new BadRequestError("failed to add vital sign ")
    }


}

const getVitalSign = async(req, res) => {
    const VitalSign_id = req.query.id;
    const vitalSign = await VitalSign.findById(VitalSign_id);
    if (!vitalSign) {
        throw new NotFoundError("no vital sign found for this id")
    }
    res.status(StatusCodes.OK).json({ "data": vitalSign, "msg": "success" });

}


const getAllVitalSigns = async(req, res) => {
    const VitalSigns = await VitalSign.find({});
    if (!VitalSigns.length) {
        throw new NotFoundError("no vital signs found in database")
    }
    res.status(StatusCodes.OK).json({ "data": VitalSigns, "msg": "success" });

}

const updateVitalSign = async(req, res) => {
    const VitalSign_id = req.query.id;
    const { _id, patient_id, ...others } = req.body;
    const vitalFromDB = await VitalSign.findById(VitalSign_id);
    if (!vitalFromDB) {
        throw new NotFoundError("no vital sign matches this id")
    }

    if (req.user.userId !== vitalFromDB.patient_id.toString()) {
        throw new UnauthorizedError("you can update only your vital signs")
    }
    const vitalSign = await VitalSign.findByIdAndUpdate(VitalSign_id, { $set: others }, { runValidators: true, new: true });
    res.status(StatusCodes.OK).json({ "data": vitalSign, msg: "the VitalSign is updated succesfully" });

};


const deleteVitalSign = async(req, res) => {
    const VitalSign_id = req.query.id;
    const vitalFromDB = await VitalSign.findById(VitalSign_id);
    if (!vitalFromDB) {
        throw new NotFoundError("no vital sign matches this id")
    }

    if (req.user.userId !== vitalFromDB.patient_id.toString()) {
        throw new UnauthorizedError("you can delete only your vital signs")
    }
    const vitalSign = await VitalSign.findByIdAndRemove(VitalSign_id);
    res.status(StatusCodes.OK).json({ msg: "the VitalSign is deleted succesfully" });

}




module.exports = {
    createVitalSign,
    getVitalSign,
    getAllVitalSigns,
    updateVitalSign,
    deleteVitalSign
}