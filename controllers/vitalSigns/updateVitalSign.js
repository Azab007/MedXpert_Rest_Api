const VitalSign = require('../../models/VitalSigns')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, UnauthorizedError } = require('../../errors');

exports.updateVitalSign = async(req, res) => {
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
    //checkVitalSigns([vitalSign]);
    res.status(StatusCodes.OK).json({ "data": vitalSign, msg: "the VitalSign is updated succesfully" });

};