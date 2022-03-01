const Pharma_inc = require('../models/Pharma_Inc.js')
const { StatusCodes } = require('http-status-codes');
const { default: mongoose } = require('mongoose');
const { NotFoundError } = require('../errors');


const getPharma = async(req, res) => {
    const Pharma_id = req.query.id;
    const Pharma = await Pharma_inc.findById(Pharma_id);
    if (!Pharma) {
        throw new NotFoundError("no pharma incorporation found for this id")
    }
    res.status(StatusCodes.OK).json(Pharma);

}


const getAllPharmas = async(req, res) => {
    const Pharmas = await Pharma_inc.find({});
    res.status(StatusCodes.OK).json(Pharmas);

}

const updatePharma = async(req, res) => {
    const Pharma_id = req.query.id;
    const { email, username, Location } = req.body
    const Pharma = await Pharma_inc.findByIdAndUpdate(Pharma_id, { $set: { email, username, Location } }, { runValidators: true, new: true });
    if (!Pharma) {
        throw new NotFoundError("no Pharma matches this id");
    }

    res.status(StatusCodes.OK).json({ Pharma, msg: "the Pharma is updated succesfully" });
};


const deletePharma = async(req, res) => {

    const Pharma_id = req.query.id;
    const Pharma = await Pharma_inc.findByIdAndRemove(Pharma_id, { runValidators: true, new: true });
    if (!Pharma) {
        throw new NotFoundError("no Pharma matches this id");
    }
    res.status(StatusCodes.OK).json({ msg: "the Pharma is deleted succesfully" });



}




module.exports = {
    getPharma,
    getAllPharmas,
    updatePharma,
    deletePharma
};