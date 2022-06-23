const VitalSign = require('../../models/VitalSigns')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError } = require('../../errors');

exports.getVitalSignPatient = async(req, res) => {

    const patient_id = req.user.userId;
    const vitalSigns = await VitalSign.find({ patient_id: patient_id }, {}, { sort: { 'createdAt': -1 }, limit: 5 });
    const resData = [...vitalSigns]
    if (!vitalSigns.length) {
        throw new NotFoundError("no vital signs found for this id")
    }
    //checkVitalSigns(vitalSigns);
    res.status(StatusCodes.OK).json({ "data": resData, "msg": "success" });

}