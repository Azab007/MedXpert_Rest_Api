const Drug = require('../models/Drug.js')
const { default: mongoose } = require('mongoose');
const { NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const createDrug = async(req, res) => {

    const newDrug = new Drug({
        ...req.body
    });

    await newDrug.save();
    res.status(StatusCodes.CREATED).json(newDrug);

}

const getDrug = async(req, res) => {
    const drug_id = req.query.id;
    const drug = await Drug.findById(drug_id);
    if (!drug) {
        throw new NotFoundError("Drug Not Found");
    }
    res.status(StatusCodes.OK).json(drug);

}


const getAllDrugs = async(req, res) => {
    const drugs = await Drug.find({});
    res.status(StatusCodes.OK).json(drugs);

}

const updateDrug = async(req, res) => {
    const drug_id = req.query.id;
    const drug = await Drug.findByIdAndUpdate(drug_id, {
        $set: req.body
    }, {
        runValidators: true,
        new: true
    });
    if (!drug) {
        throw new NotFoundError("no drug matches this id")
    }

    res.status(StatusCodes.OK).json({
        drug,
        msg: "the Drug is updated succesfully"
    });
};


const deleteDrug = async(req, res) => {

    const drug_id = req.query.id;
    const drug = await Drug.findByIdAndRemove(drug_id, { runValidators: true, new: true });
    if (!drug) {
        throw new NotFoundError("no drug matches this id ")
    }
    res.status(StatusCodes.OK).json({ msg: "the Drug is deleted succesfully" });



}


const addToList = async(req, res) => {

    const drug_id = req.query.id;
    const { interactions, restrictions } = req.body
    const newData = await Drug.findByIdAndUpdate(drug_id, {
        $addToSet: {
            interactions,
            restrictions
        }
    }, {
        runValidators: true,
        new: true
    });
    if (!newData) {
        throw new NotFoundError("no matches for this id");
    }

    res.status(StatusCodes.OK).json({
        newData,
        msg: "the data is added succesfully"
    });

}


const deleteFromList = async(req, res) => {

    const id = req.query.id;
    // const {drug_id} = req.body.interactions;
    // const {condition_name} = req.body.restrictions;
    // if (drug_id) {
    //         const newData = await Drug.findByIdAndUpdate(id, {$pull: {interactions: {drug_id}, restrictions: {condition_name} }, }, { runValidators: true, new: true });
    // }
    // if(condition_name) {
    //         const newData = await Drug.findByIdAndUpdate(id, {$pull: {interactions: {drug_id}, restrictions: {condition_name} }, }, { runValidators: true, new: true });
    // }
    const { interactions, restrictions } = req.body
    const newData = await Drug.findByIdAndUpdate(id, { $pull: { interactions, restrictions }, }, { runValidators: true, new: true });
    if (!newData) {
        throw new NotFoundError("no matches for this id");
    }
    res.status(StatusCodes.OK).json({ newData, msg: "the data is deleted succesfully" });
}



module.exports = {
    createDrug,
    getDrug,
    getAllDrugs,
    updateDrug,
    deleteDrug,
    addToList,
    deleteFromList
};