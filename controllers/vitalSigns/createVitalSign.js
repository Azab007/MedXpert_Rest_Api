const VitalSign = require('../../models/VitalSigns')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { BadRequestError } = require('../../errors');

exports.createVitalSign = async(req, res) => {
    const patientId = req.user.userId;
    const { _id, patient_id, ...others } = req.body;
    try {
        const newVitalSign = new VitalSign({
            ...others,
            patient_id: patientId
        });

        await newVitalSign.save();
        // checkVitalSigns([newVitalSign]);
        res.status(StatusCodes.CREATED).json({ "data": newVitalSign, "msg": "vital sign created successfully" });

    } catch (error) {
        throw new BadRequestError(error.msg);
    }


}