const Medication = require('../models/Medication.js')
const {Err} = require('../middleware/throw_error.js');
const { default: mongoose } = require('mongoose');
const createMedication = async (req, res) => {
        const newMedication = new Medication({
            ...req.body
        });

        await newMedication.save();
        res.status(201).json(newMedication);
   
}

const getMedication = async(req, res) => {
        const Medication_id = req.query.id;
        const medication = await Medication.findById(Medication_id);
        res.status(200).json(medication);
    
}


const getAllMedications = async (req, res) => {
 
        const Medications = await Medication.find({});
        res.status(200).json(Medications);
    
}

const updateMedication =async (req, res) => {
        const Medication_id = req.query.id;
        const medication = await Medication.findByIdAndUpdate(Medication_id, {$set: req.body}, { runValidators: true, new: true });
        if(!medication) {
           throw Err("no Medication matches this id", 404);
        }
        
        res.status(200).json({medication,msg:"the Medication is updated succesfully"});
   
};


const deleteMedication =async (req, res) => {
        const Medication_id = req.query.id;
        const medication = await Medication.findByIdAndRemove(Medication_id);
        if(!medication) {
            throw Err("no Medication matches this id", 404);
        }
        res.status(200).json({msg:"the Medication is deleted succesfully"});
    
}

const addMedicationDrug = async (req, res) => {
        const medication_id = req.query.id;
        const medication = await Medication.findByIdAndUpdate(medication_id, {$push: {drugs: req.body}}, { runValidators: true, new: true });
        if(!medication) {
            throw Err("no Medication matches this id", 404);
        }
        res.status(200).json({medication ,msg:"the Medication drug is added succesfully"});
   
}

const deleteMedicationDrug = async (req, res) => {
        const medication_id = req.query.id;
        const medication = await Medication.findByIdAndUpdate(medication_id, {$pull: {drugs: {drug_id: mongoose.Types.ObjectId(req.body.drug_id)}}}, { runValidators: true, new: true });
        if(!medication) {
            throw Err("no medication matches this id", 404);
        }
        res.status(200).json({medication,msg:"the medication drug is deleted succesfully"});
   
}




module.exports = {
    createMedication, getMedication, getAllMedications, updateMedication, deleteMedication, addMedicationDrug, deleteMedicationDrug
};