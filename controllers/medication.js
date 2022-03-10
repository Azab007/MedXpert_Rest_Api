const Medication = require('../models/Medication.js')
const Patient = require('../models/Patient')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors');
const Doctor = require('../models/Doctor.js');


const createMedication = async(req, res) => {
    const docId = req.user.userId
    const patientId = req.query.id
    const { patient_id, ...others } = req.body
    try {
        const newMedication = new Medication({
            ...others,
            patient_id: patientId,
            doctor_id: docId
        });

        await newMedication.save();
        res.status(StatusCodes.CREATED).json({ "data": newMedication, "msg": "Medication created successfully" });

    } catch (error) {
        throw new BadRequestError(error.message);
    }


}

const getMedication = async(req, res) => {
    const Medication_id = req.query.id;
    const medication = await Medication.findById(Medication_id);
    if (!medication) {
        throw new NotFoundError("no medication found for this id")
    }
    res.status(StatusCodes.OK).json({ "data": medication, "msg": "success" });

}


const getAllMedications = async(req, res) => {

    const Medications = await Medication.find({});
    if (!Medications.length) {
        throw new NotFoundError("No medications in database")
    }
    res.status(StatusCodes.OK).json({ "data": Medications, "msg": "success" });

}

const updateMedication = async(req, res) => {
    const Medication_id = req.query.id;
    const { _id, drugs, ...others } = req.body
    const MedFromDB = await Medication.findById(Medication_id);
    if (!MedFromDB) {
        throw new NotFoundError("no Medication matches this id")
    }

    if (req.user.userId !== MedFromDB.doctor_id.toString()) {
        throw new UnauthorizedError("you can update only your Medications")
    }
    const medication = await Medication.findByIdAndUpdate(Medication_id, { $set: others }, { runValidators: true, new: true });
    res.status(StatusCodes.OK).json({ "data": medication, msg: "the Medication is updated succesfully" });

};


const deleteMedication = async(req, res) => {
    const Medication_id = req.query.id;
    const MedFromDB = await Medication.findById(Medication_id);
    if (!MedFromDB) {
        throw new NotFoundError("no Medication matches this id")
    }

    if (req.user.userId !== MedFromDB.doctor_id.toString()) {
        throw new UnauthorizedError("you can delete only your Medications")
    }
    await MedFromDB.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "the Medication is deleted succesfully" });

}

const addMedicationDrug = async(req, res) => {
    const medication_id = req.query.id;
    const MedFromDB = await Medication.findById(medication_id);
    if (!MedFromDB) {
        throw new NotFoundError("no Medication matches this id")
    }

    if (req.user.userId !== MedFromDB.doctor_id.toString()) {
        throw new UnauthorizedError("you can delete only your Medications")
    }
    const medication = await Medication.findByIdAndUpdate(medication_id, { $addToSet: { drugs: req.body } }, { runValidators: true, new: true });
    res.status(StatusCodes.OK).json({ "data": medication, msg: "the Medication drug is added succesfully" });

}

const deleteMedicationDrug = async(req, res) => {
    const medication_id = req.query.id;
    const MedFromDB = await Medication.findById(medication_id);
    if (!MedFromDB) {
        throw new NotFoundError("no Medication matches this id")
    }

    if (req.user.userId !== MedFromDB.doctor_id.toString()) {
        throw new UnauthorizedError("you can delete only your Medications")
    }
    const medication = await Medication.findByIdAndUpdate(medication_id, { $pull: { drugs: { drug_id: mongoose.Types.ObjectId(req.body.drug_id) } } }, { runValidators: true, new: true });
    res.status(StatusCodes.OK).json({ "data": medication, msg: "the medication drug is deleted succesfully" });

}

const getFollowingMedication = async(req, res) => {
    const followingid = req.query.id;
    const myid = req.user.userId;
    const me = req.user.role === 'patient' ? await Patient.findById(myid) : await Doctor.findById(myid);
    const followingIds = me.followings.map(id => id.toString())
    if (!followingIds.includes(followingid)) {
        throw UnauthenticatedError("you can not access this data")
    }
    const Medications = await Medication.find({ "patient_id": followingid, "currentlyTaken": true });
    res.status(StatusCodes.OK).json({ "data": Medications, msg: "success" });
}



module.exports = {
    createMedication,
    getMedication,
    getAllMedications,
    updateMedication,
    deleteMedication,
    addMedicationDrug,
    deleteMedicationDrug,
    getFollowingMedication
};