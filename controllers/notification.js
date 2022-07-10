const Notification = require('../models/Notification')
const Patient = require('../models/Patient')
const Medication = require('../models/Medication')
const { StatusCodes } = require('http-status-codes');


const createNotification = async(req, res) => {
    const { expireAt, medicationId, drugUniqueId, drugName, date, time, dateTime } = req.body
    const newNotification = new Notification({
        drugUniqueId,
        drugName,
        date,
        time,
        expireAt,
        patientId: req.user.userId
    });

    await newNotification.save();

    // const med = await Medication.findById(medicationId)
    // const drug = med.drugs.find(obj => obj._id.toString() == drugUniqueId)
    // drug.isDoseTaken.push(null)
    // drug.doseDates.push(dateTime)

    await med.save()
    res.status(StatusCodes.CREATED).json({
        "data": newNotification,
        "msg": "Notification created successfully",
    });
}



const getNotification = async(req, res) => {
    const patientId = req.user.userId;
    const patient = await Patient.findById(patientId)
    const followings = patient.followings
    let patients = []
    for (let i = 0; i < followings.length; i++) {
        const lis = await Notification.find({ patientId: followings[i].toString() }).populate('patientId', 'username');
        //console.log(lis)
        patients = patients.concat(lis)
    }

    res.status(StatusCodes.OK).json({ "data": patients, msg: "success" });
};


const deleteNotification = async(req, res) => {

    const { drugUniqueId, drugName, date, time } = req.body;

    await Notification.findOneAndRemove({ drugUniqueId: drugUniqueId, drugName: drugName, date: date, time: time });
    res.status(StatusCodes.OK).json({ msg: "the notification is deleted succesfully" });



}

const deleteNotificationByDrugUniqueId = async(req, res) => {

    const id = req.query.id;

    await Notification.remove({ drugUniqueId: id });
    res.status(StatusCodes.OK).json({ msg: "the notifications is deleted succesfully" });



}




module.exports = {
    createNotification,
    deleteNotification,
    getNotification,
    deleteNotificationByDrugUniqueId
};