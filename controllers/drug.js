const Drug = require('../models/Drug.js')
const { default: mongoose } = require('mongoose');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const createDrug = async(req, res) => {
    const pharma_id = req.user.userId;
    const { inc_id, ...others } = req.body;
    try {
        const newDrug = new Drug({
            ...others,
            Inc_id: pharma_id

        });

        await newDrug.save();
        res.status(StatusCodes.CREATED).json({ "data": newDrug, "msg": "Drug is created successfully" });
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
    res.status(StatusCodes.OK).json({ "data": drug, "msg": "sucess" });

}


const getAllDrugs = async(req, res) => {
    const drugs = await Drug.find({});
    if (!drugs.length) {
        throw new NotFoundError('no drugs in database')
    }
    res.status(StatusCodes.OK).json({ "data": drugs, "msg": "success" });

}

const updateDrug = async(req, res) => {
    const drug_id = req.query.id;
    const { interactions, restrictions, _id, ...others } = req.body
    const drugFromDB = await Drug.findById(drug_id);
    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }

    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can update only your drugs")
    }

    const drug = await Drug.findByIdAndUpdate(drug_id, {
        $set: others
    }, {
        runValidators: true,
        new: true
    });


    res.status(StatusCodes.OK).json({
        "data": drug,
        "msg": "the Drug is updated succesfully"
    });
};


const deleteDrug = async(req, res) => {

    const drug_id = req.query.id;
    const drugFromDB = await Drug.findById(drug_id);

    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }

    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can delete only your drugs")
    }
    await drugFromDB.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "the Drug is deleted succesfully" });



}


const addToList = async(req, res) => {

    const drug_id = req.query.id;
    const { interactions, restrictions } = req.body
    const drugFromDB = await Drug.findById(drug_id);
    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }

    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can add only to your lists")
    }
    const newData = await Drug.findByIdAndUpdate(drug_id, {
        $addToSet: {
            interactions,
            restrictions
        }
    }, {
        runValidators: true,
        new: true
    });

    res.status(StatusCodes.OK).json({
        "data": newData,
        msg: "the data is added succesfully"
    });

}


const deleteFromList = async(req, res) => {

    const id = req.query.id;
    const drugFromDB = await Drug.findById(drug_id);
    if (!drugFromDB) {
        throw new NotFoundError("no drug matches this id")
    }



    if (req.user.userId !== drugFromDB.Inc_id.toString()) {
        throw new UnauthorizedError("you can delete only from your lists")
    }
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
    res.status(StatusCodes.OK).json({ "data": newData, msg: "the data is deleted succesfully" });
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