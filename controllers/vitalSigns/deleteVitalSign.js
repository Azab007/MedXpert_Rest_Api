const VitalSign = require('../../models/VitalSigns.js')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, UnauthorizedError } = require('../../errors');

exports.deleteVitalSign = async(req, res) => {
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