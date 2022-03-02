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
    const { password, ...rest } = Pharma
    res.status(StatusCodes.OK).json({ "data": rest, "msg": "success" });

}


const getAllPharmas = async(req, res) => {
    const Pharmas = await Pharma_inc.find({});
    if (!Pharmas.length) {
        throw new NotFoundError("no pharma incorporation found in database")
    }
    const ret = Pharmas.map(pharma => { delete pharma._pharma.password; return pharma })
    res.status(StatusCodes.OK).json({ "data": ret, "msg": "success" });

}

const updatePharma = async(req, res) => {
    const Pharma_id = req.user.userId;
    const { email, username, Location } = req.body
    const Pharma = await Pharma_inc.findByIdAndUpdate(Pharma_id, { $set: { email, username, Location } }, { runValidators: true, new: true });
    if (!Pharma) {
        throw new NotFoundError("no Pharma matches this id");
    }

    res.status(StatusCodes.OK).json({ "data": Pharma, msg: "the Pharma is updated succesfully" });
};


const deletePharma = async(req, res) => {

    const Pharma_id = req.user.userId;
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