const VitalSign = require('../../models/VitalSigns.js')
const Patient = require('../../models/Patient');
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, UnauthorizedError } = require('../../errors');


exports.getVitalSignDoctor = async(req, res) => {
    const search = (arr, key) => (arr.find(x => x.doctor_id.toString() === key))

    // const patient_name = req.query.name;
    // const patient = await Patient.findOne({ username: patient_name });
    const patient_id = req.query.id;
    //const patient_id = patient._id;
    const vitalSigns = await VitalSign.find({ patient_id: patient_id }, {}, { sort: { 'createdAt': -1 } });
    const resData = [...vitalSigns]
    // if (!vitalSigns.length) {
    //     throw new NotFoundError("no vital signs found for this id")
    // }
    for (let i = 0; i < vitalSigns.length; i++) {
        const vital = await vitalSigns[i].populate('patient_id', 'clinicians');
        const clinicians = vital.patient_id.clinicians
        if (!search(clinicians, req.user.userId)) {
            throw new UnauthorizedError("you can see only your patients vital signs")
        }


    }
    // checkVitalSigns(vitalSigns);
    res.status(StatusCodes.OK).json({ "data": resData, "msg": "success" });

}