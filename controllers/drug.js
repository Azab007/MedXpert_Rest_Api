const Drug = require('../models/Drug.js')
const { default: mongoose } = require('mongoose');
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const createDrug = async(req, res) => {
    try {
        const newDrug = new Drug({
            ...req.body
        });

        await newDrug.save();
        res.status(StatusCodes.CREATED).json(newDrug);
    } catch (error) {
        throw new BadRequestError(error.message)
    }


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
    if (!drugs.length) {
        throw new NotFoundError('no drugs in database')
    }
    res.status(StatusCodes.OK).json(drugs);

}

const updateDrug = async(req, res) => {
    const drug_id = req.query.id;
    const { interactions, restrictions, _id, ...others } = req.body
    const drug = await Drug.findByIdAndUpdate(drug_id, {
        $set: others
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
    const {
        interactions: {
            drug_id = null
        } = {
            drug_id: null
        },
        restrictions: {
            condition_name = "null"
        } = {
            condition_name: "null"
        }
    } = req.body
    const newData = await Drug.findByIdAndUpdate(id, { $pull: { interactions: { "drug_id": drug_id }, restrictions: { "condition_name": condition_name } }, }, { runValidators: true, new: true });
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