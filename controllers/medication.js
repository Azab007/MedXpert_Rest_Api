const Medication = require('../models/Medication.js')
const Drug = require('../models/Drug')
const Patient = require('../models/Patient')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors');
const { object } = require('underscore');
const Doctor = require('../models/Doctor.js');

const checkInteractions = async(drugList) => {
    const drugsIDs = drugList.map(drug => drug.drug_id)
    let Interactions = new object
    for (const drugID of drugsIDs) {
        const { interactions } = await Drug.findById(drugID);
        interactions.forEach(drug => {
            if (drugsIDs.includes(drug.drug_id.toString())) {
                const { drug_id, description, level } = drug
                IDs = [drugID, drug_id.toString()].sort()
                Interactions[IDs[0].concat(IDs[1])] = {
                    IDs,
                    description,
                    level
                }
            }
        })
    }
    return Object.values(Interactions)
}

const checkRestrictions = async(drugList, patientID) => {
    const { chronics } = await Patient.findById(patientID);
    const chronicNames = chronics.map(chronic => chronic.chronic_name)
    const drugsIDs = drugList.map(drug => drug.drug_id)

    let Restrections = []
    for (const drugID of drugsIDs) {
        let { restrictions } = await Drug.findById(drugID);
        restrictions = restrictions.map(item => item.condition_name)
        for (const chronicName of chronicNames) {
            if (restrictions.includes(chronicName)) {
                Restrections.push({
                    "id": drugID,
                    "chronic": chronicName
                })
            }
        }
    }
    return Restrections

}


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
        const interactions = await checkInteractions(others.drugs)
        const restrictions = await checkRestrictions(others.drugs, patientId)

        // console.log(interactions)
        res.status(StatusCodes.CREATED).json({
            "data": newMedication,
            "msg": "Medication created successfully",
            interactions,
            restrictions
        });

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
    const interactions = await checkInteractions(medication.drugs)
    const restrictions = await checkRestrictions(others.drugs, medication.patient_id)
    res.status(StatusCodes.OK).json({
        "data": medication,
        "msg": "success",
        interactions,
        restrictions
    });

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
    const interactions = await checkInteractions(medication.drugs)
    const restrictions = await checkRestrictions(others.drugs, medication.patient_id)
    res.status(StatusCodes.OK).json({
        "data": medication,
        msg: "the Medication is updated succesfully",
        interactions,
        restrictions
    });

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
    const interactions = await checkInteractions(medication.drugs)
    const restrictions = await checkRestrictions(others.drugs, medication.patient_id)
    res.status(StatusCodes.OK).json({
        "data": medication,
        msg: "the Medication drug is added succesfully",
        interactions,
        restrictions
    });

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
    const interactions = await checkInteractions(medication.drugs)
    const restrictions = await checkRestrictions(others.drugs, medication.patient_id)
    res.status(StatusCodes.OK).json({
        "data": medication,
        msg: "the medication drug is deleted succesfully",
        interactions,
        restrictions
    });

}

const getFollowingMedication = async(req, res) => {
    const followingid = req.query.id;
    const myid = req.user.userId;
    const me = await Patient.findById(myid);
    const followingIds = me.followings.map(id => id.toString())
    if (!followingIds.includes(followingid)) {
        throw UnauthenticatedError("you can not access this data")
    }
    const Medications = await Medication.find({ "patient_id": followingid, "currentlyTaken": true });
    const interactions = await checkInteractions(medication.drugs)
    const restrictions = await checkRestrictions(others.drugs, medication.patient_id)
    res.status(StatusCodes.OK).json({
        "data": Medications,
        msg: "success",
        interactions,
        restrictions
    });
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