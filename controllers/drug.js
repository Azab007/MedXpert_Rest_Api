const Drug = require('../models/Drug.js')
const {Err} = require('../middleware/throw_error.js');
const { default: mongoose } = require('mongoose');
const createDrug = async (req, res) => {

        const newDrug = new Drug({
            ...req.body
        });

        await newDrug.save();
        res.status(201).json(newDrug);
    
}

const getDrug = async(req, res) => {
        const drug_id = req.query.id;
        const drug = await Drug.findById(drug_id);
        res.status(200).json(drug);
   
}


const getAllDrugs = async (req, res) => {
        const drugs = await Drug.find({});
        res.status(200).json(drugs);
   
}

const updateDrug =async (req, res) => {
        const drug_id = req.query.id;
        const drug = await Drug.findByIdAndUpdate(drug_id, {$set: req.body} , { runValidators: true, new: true });
        if(!drug) {
           throw Err("no drug matches this id", 404);
        }
 
        res.status(200).json({drug, msg:"the Drug is updated succesfully"});
};


const deleteDrug =async (req, res) => {
    
        const drug_id = req.query.id;
        const drug = await Drug.findByIdAndRemove(drug_id, { runValidators: true, new: true });
        if(!drug) {
           throw Err("no drug matches this id", 404);
        }
            res.status(200).json({msg:"the Drug is deleted succesfully"});

        
    
}


const addInteraction = async(req, res) => {
    
        const drug_id = req.query.id;

        const drug = await Drug.findByIdAndUpdate(drug_id, {$push: {interactions: req.body}} , { runValidators: true, new: true });
        if(!drug) {
           throw Err("no drug matches this id", 404);
        }
        
        res.status(200).json({drug, msg:"the Drug interaction is added succesfully"});

}


const deleteInteraction = async (req, res) => {
  
        const drug_id = req.query.id;
        const drug = await Drug.findByIdAndUpdate(drug_id, {$pull: {interactions: {drug_id: mongoose.Types.ObjectId(req.body.drug_id)}}}, { runValidators: true, new: true });
        if(!drug) {
           throw Err("no drug matches this id", 404);
        }
        res.status(200).json({msg: "the Drug interaction is deleted succesfully"});
    }

const addRestrictions = async(req, res) => {
        const drug_id = req.query.id;
        const drug = await Drug.findByIdAndUpdate(drug_id, {$push: {restrictions: req.body}}, { runValidators: true, new: true });
        if(!drug) {
           throw Err("no drug matches this id", 404);
        }
        res.status(200).json("the Drug restriction is added succesfully");
   
}


const deleteRestrictions = async (req, res) => {

        const drug_id = req.query.id;
        const drug = await Drug.findByIdAndUpdate(drug_id, {$pull: {restrictions: {condition_name: req.body.condition_name}}}, { runValidators: true, new: true });
        if(!drug) {
           throw Err("no drug matches this id", 404);
        }
        res.status(200).json("the Drug restriction is deleted succesfully");
}

module.exports = {
    createDrug, getDrug, getAllDrugs, updateDrug, deleteDrug, addInteraction, deleteInteraction, addRestrictions, deleteRestrictions
};