const Medication = require('../models/Medication.js')
const {Err} = require('../middleware/throw_error.js');
const { default: mongoose } = require('mongoose');
const createMedication = async (req, res) => {
    try {
        const newMedication = new Medication({
            ...req.body
        });

        await newMedication.save();
        res.status(201).json(newMedication);
    } catch (error) {
       Err("creating Medication failed please check you parameterms and try again", 500)
    }
}

const getMedication = async(req, res) => {
    try {
        const Medication_id = req.query.id;
        const Medication = await Medication.findById(Medication_id);
        res.status(200).json(Medication);
    } catch (error) {
        Err("could not get the Medication please try again", 500)
    }
}


const getAllMedications = async (req, res) => {
    try {
        const Medications = await Medication.find({});
        res.status(200).json(Medications);
    } catch (error) {
        Err("could not get the Medications please try again", 500)
    }
}

const updateMedication =async (req, res) => {
    try {
        const Medication_id = req.query.id;
        const Medication = await Medication.findById(Medication_id);
        if(!Medication) {
            Err("no Medication matches this id", 404);
        }
        await Medication.updateOne({$set: req.body});
        res.status(200).json("the Medication is updated succesfully");
    } catch (error) {
        Err("could not update the Medication, pls try again", 500)
    }
};


const deleteMedication =async (req, res) => {
    try {
        const Medication_id = req.query.id;
        const Medication = await Medication.deleteOne({_id: Medication_id});
        if(!Medication) {
            Err("no Medication matches this id", 404);
        }
        res.status(200).json("the Medication is deleted succesfully");
    } catch (error) {
        Err("could not delete the Medication, pls try again", 500)
    }
}

const addMedicationDrug = async (req, res) => {
    try {
        const medication_id = req.query.id;
        const medication = await Medication.updateOne({_id: medication_id}, {$push: {drugs: req.body}});
        if(!medication) {
            Err("no Medication matches this id", 404);
        }
        res.status(200).json("the Medication drug is added succesfully");
    } catch (error) {
        Err("could not add the medication drug, pls try again", 500)
    }
}

const deleteMedicationDrug = async (req, res) => {
    try {
        const medication_id = req.query.id;
        const medication = await Medication.updateOne({_id: medication_id}, {$pull: {drugs: {drug_id: mongoose.Types.ObjectId(req.body.drug_id)}}});
        if(!medication) {
            Err("no medication matches this id", 404);
        }
        res.status(200).json("the medication drug is deleted succesfully");
    } catch (error) {
        Err("could not delete the medication drug, pls try again", 500)
    }
}




module.exports = {
    createMedication, getMedication, getAllMedications, updateMedication, deleteMedication, addMedicationDrug, deleteMedicationDrug
};