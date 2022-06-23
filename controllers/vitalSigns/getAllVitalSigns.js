const VitalSign = require('../../models/VitalSigns.js')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError } = require('../../errors');

exports.getAllVitalSigns = async(req, res) => {
    const VitalSigns = await VitalSign.find({});
    if (!VitalSigns.length) {
        throw new NotFoundError("no vital signs found in database")
    }
    res.status(StatusCodes.OK).json({ "data": VitalSigns, "msg": "success" });

}