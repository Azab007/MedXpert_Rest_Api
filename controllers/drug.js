const Drug = require('../models/Drug.js')
const {Err} = require('../middleware/throw_error.js');
const { default: mongoose } = require('mongoose');
const createDrug = async (req, res) => {
    try {
        const newDrug = new Drug({
            ...req.body
        });

        await newDrug.save();
        res.status(201).json(newDrug);
    } catch (error) {
       Err("creating Drug failed please check you parameterms and try again", 500)
    }
}

const getDrug = async(req, res) => {
    try {
        const drug_id = req.query.id;
        const drug = await Drug.findById(drug_id);
        res.status(200).json(drug);
    } catch (error) {
        Err("could not get the drug please try again", 500)
    }
}


const getAllDrugs = async (req, res) => {
    try {
        const drugs = await Drug.find({});
        res.status(200).json(drugs);
    } catch (error) {
        Err("could not get the drugs please try again", 500)
    }
}

const updateDrug =async (req, res) => {
    try {
        const drug_id = req.query.id;
        const drug = await Drug.findById(drug_id);
        if(!drug) {
            Err("no drug matches this id", 404);
        }
        await Drug.updateOne({$set: req.body});
        res.status(200).json("the Drug is updated succesfully");
    } catch (error) {
        Err("could not update the drug, pls try again", 500)
    }
};


const deleteDrug =async (req, res) => {
    try {
        const drug_id = req.query.id;
        const drug = await Drug.deleteOne({_id: drug_id});
        if(!drug) {
            Err("no drug matches this id", 404);
        }
        res.status(200).json("the Drug is deleted succesfully");
    } catch (error) {
        Err("could not delete the drug, pls try again", 500)
    }
}


const addInteraction = async(req, res) => {
    try {
        const drug_id = req.query.id;
        const drug = await Drug.updateOne({_id: drug_id}, {$push: {interactions: req.body}});
        if(!drug) {
            Err("no drug matches this id", 404);
        }
        res.status(200).json("the Drug interaction is added succesfully");
    } catch (error) {
        Err("could not add the drug interaction, pls try again", 500)
    }
}


const deleteInteraction = async (req, res) => {
    try {
        const drug_id = req.query.id;
        const drug = await Drug.updateOne({_id: drug_id}, {$pull: {interactions: {drug_id: mongoose.Types.ObjectId(req.body.drug_id)}}});
        if(!drug) {
            Err("no drug matches this id", 404);
        }
        res.status(200).json("the Drug interaction is deleted succesfully");
    } catch (error) {
        Err("could not delete the drug interaction, pls try again", 500)
    }
}

const addRestrictions = async(req, res) => {
    try {
        const drug_id = req.query.id;
        const drug = await Drug.updateOne({_id: drug_id}, {$push: {restrictions: req.body}});
        if(!drug) {
            Err("no drug matches this id", 404);
        }
        res.status(200).json("the Drug restriction is added succesfully");
    } catch (error) {
        Err("could not delete the drug restrictions, pls try again", 500)
    }
}


const deleteRestrictions = async (req, res) => {
    try {
        const drug_id = req.query.id;
        const drug = await Drug.updateOne({_id: drug_id}, {$pull: {restrictions: {condition_name: req.body.condition_name}}});
        if(!drug) {
            Err("no drug matches this id", 404);
        }
        res.status(200).json("the Drug restriction is deleted succesfully");
    } catch (error) {
        Err("could not delete the drug restriction, pls try again", 500)
    }
}

module.exports = {
    createDrug, getDrug, getAllDrugs, updateDrug, deleteDrug, addInteraction, deleteInteraction, addRestrictions, deleteRestrictions
};