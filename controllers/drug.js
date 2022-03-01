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


const addToList = async(req, res) => {
    
        const drug_id = req.query.id;
        const {interactions, restrictions} = req.body
        const newData = await Drug.findByIdAndUpdate(drug_id, {$addToSet: {interactions, restrictions}} , { runValidators: true, new: true });
        if(!newData) {
           throw Err("no matches for this id", 404);
        }
        
        res.status(200).json({newData, msg:"the data is added succesfully"});

}


const deleteFromList = async (req, res) => {
  
        const id = req.query.id;
        const drug_id = req.body.interactions ? req.body.interactions.drug_id : null ;
        const condition_name = req.body.restrictions ? req.body.restrictions.condition_name : null;

        const newData = await Drug.findByIdAndUpdate(id, {$pull: {interactions: {drug_id}, restrictions: {condition_name} }, }, { runValidators: true, new: true });
        if(!newData) {
           throw Err("no matches for this id", 404);
        }
        res.status(200).json({newData, msg: "the data is deleted succesfully"});
    }



module.exports = {
    createDrug, getDrug, getAllDrugs, updateDrug, deleteDrug, addToList, deleteFromList
};