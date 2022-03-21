const VitalSign = require('../models/VitalSigns.js')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../errors');


const checkVitalSigns = (vitals) => {

    const temp_thres_min = 0;
    const temp_thres_max = 10;

    const pulse_thres_min = 0;
    const pulse_thres_max = 0;

    const respration_thres_min = 0;
    const respration_thres_max = 0;

    const pressure_thres_min = 0;
    const pressure_thres_max = 0;

    const weight_thres_min = 0;
    const weight_thres_max = 0;
    vitals.forEach((vital, _) => {
        if (vital.temp && (vital.temp > temp_thres_max || vital.temp < temp_thres_min)) {
            vital.problems.push("temp");
        }

        if (vital.pulse && (vital.pulse > pulse_thres_max || vital.pulse < pulse_thres_min)) {
            vital.problems.push("pulse");
        }

        if (vital.respration && (vital.respration > respration_thres_max || vital.respration < respration_thres_min)) {
            vital.problems.push("respration");
        }

        if (vital.pressure && (vital.pressure > pressure_thres_max || vital.pressure < pressure_thres_min)) {
            vital.problems.push("pressure");
        }

        if (vital.weight && (vital.weight > weight_thres_max || vital.weight < weight_thres_min)) {
            vital.problems.push("weight");
        }
    })
}

const createVitalSign = async(req, res) => {
    const patientId = req.user.userId;
    const { _id, patient_id, ...others } = req.body;
    try {
        const newVitalSign = new VitalSign({
            ...others,
            patient_id: patientId
        });

        await newVitalSign.save();
        checkVitalSigns([newVitalSign]);
        res.status(StatusCodes.CREATED).json({ "data": newVitalSign, "msg": "vital sign created successfully" });

    } catch (error) {
        throw new BadRequestError("failed to add vital sign ")
    }


}

const getVitalSign = async(req, res) => {
    const search = (arr, key) => (arr.find(x => x.doctor_id.toString() === key))

    const patient_id = req.user.role === 'patient' ? req.user.userId : req.query.id;
    const vitalSigns = await VitalSign.find({ patient_id: patient_id }, {}, { sort: { 'createdAt': -1 }, limit: 5 });
    const resData = [...vitalSigns]
    if (!vitalSigns.length) {
        throw new NotFoundError("no vital signs found for this id")
    }
    if (req.user.role === 'doctor') {
        for (let i = 0; i < vitalSigns.length; i++) {
            const vital = await vitalSigns[i].populate('patient_id', 'clinicians');
            const clinicians = vital.patient_id.clinicians
            if (!search(clinicians, req.user.userId)) {
                throw new UnauthorizedError("you can see only your patients vital signs")
            }
        }

    }
    checkVitalSigns(vitalSigns);
    res.status(StatusCodes.OK).json({ "data": resData, "msg": "success" });

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
    checkVitalSigns([vitalSign]);
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