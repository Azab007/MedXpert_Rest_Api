const Medication = require('../models/Medication.js')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError } = require('../errors');
const createMedication = async(req, res) => {
    const newMedication = new Medication({
        ...req.body
    });

    await newMedication.save();
    res.status(StatusCodes.CREATED).json(newMedication);

}

const getMedication = async(req, res) => {
    const Medication_id = req.query.id;
    const medication = await Medication.findById(Medication_id);
    if (!medication) {
        throw new NotFoundError("no medication found for this id")
    }
    res.status(StatusCodes.OK).json(medication);

}


const getAllMedications = async(req, res) => {

    const Medications = await Medication.find({});
    res.status(StatusCodes.OK).json(Medications);

}

const updateMedication = async(req, res) => {
    const Medication_id = req.query.id;
    const medication = await Medication.findByIdAndUpdate(Medication_id, { $set: req.body }, { runValidators: true, new: true });
    if (!medication) {
        throw new NotFoundError("no Medication matches this id");
    }

    res.status(StatusCodes.OK).json({ medication, msg: "the Medication is updated succesfully" });

};


const deleteMedication = async(req, res) => {
    const Medication_id = req.query.id;
    const medication = await Medication.findByIdAndRemove(Medication_id);
    if (!medication) {
        throw new NotFoundError("no Medication matches this id");
    }
    res.status(StatusCodes.OK).json({ msg: "the Medication is deleted succesfully" });

}

const addMedicationDrug = async(req, res) => {
    const medication_id = req.query.id;
    const medication = await Medication.findByIdAndUpdate(medication_id, { $push: { drugs: req.body } }, { runValidators: true, new: true });
    if (!medication) {
        throw new NotFoundError("no Medication matches this id");
    }
    res.status(StatusCodes.OK).json({ medication, msg: "the Medication drug is added succesfully" });

}

const deleteMedicationDrug = async(req, res) => {
    const medication_id = req.query.id;
    const medication = await Medication.findByIdAndUpdate(medication_id, { $pull: { drugs: { drug_id: mongoose.Types.ObjectId(req.body.drug_id) } } }, { runValidators: true, new: true });
    if (!medication) {
        throw new NotFoundError("no medication matches this id");
    }
    res.status(StatusCodes.OK).json({ medication, msg: "the medication drug is deleted succesfully" });

}




module.exports = {
    createMedication,
    getMedication,
    getAllMedications,
    updateMedication,
    deleteMedication,
    addMedicationDrug,
    deleteMedicationDrug
};