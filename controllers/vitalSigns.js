const VitalSign = require('../models/VitalSigns.js')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, BadRequestError } = require('../errors');

const createVitalSign = async(req, res) => {
    try {
        const newVitalSign = new VitalSign({
            ...req.body
        });

        await newVitalSign.save();
        res.status(StatusCodes.CREATED).json(newVitalSign);

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
    res.status(StatusCodes.OK).json(vitalSign);

}


const getAllVitalSigns = async(req, res) => {
    const VitalSigns = await VitalSign.find({});
    if (!VitalSigns.length) {
        throw new NotFoundError("no vital signs found in database")
    }
    res.status(StatusCodes.OK).json(VitalSigns);

}

const updateVitalSign = async(req, res) => {
    const VitalSign_id = req.query.id;
    const vitalSign = await VitalSign.findByIdAndUpdate(VitalSign_id, { $set: req.body }, { runValidators: true, new: true });
    if (!vitalSign) {
        throw NotFoundError("no VitalSign matches this id");
    }

    res.status(StatusCodes.OK).json({ vitalSign, msg: "the VitalSign is updated succesfully" });

};


const deleteVitalSign = async(req, res) => {
    const VitalSign_id = req.query.id;
    const vitalSign = await VitalSign.findByIdAndRemove(VitalSign_id);
    if (!vitalSign) {
        throw NotFoundError("no VitalSign matches this id", 404);
    }
    res.status(StatusCodes.OK).json({ msg: "the VitalSign is deleted succesfully" });

}




module.exports = {
    createVitalSign,
    getVitalSign,
    getAllVitalSigns,
    updateVitalSign,
    deleteVitalSign
}