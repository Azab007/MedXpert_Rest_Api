const VitalSign = require('../models/VitalSigns.js')
const {Err} = require('../middleware/throw_error.js');
const { default: mongoose } = require('mongoose');

const createVitalSign = async (req, res) => {
    try {
        const newVitalSign = new VitalSign({
            ...req.body
        });

        await newVitalSign.save();
        res.status(201).json(newVitalSign);
    } catch (error) {
       Err("creating VitalSign failed please check you parameterms and try again", 500)
    }
}

const getVitalSign = async(req, res) => {
    try {
        const VitalSign_id = req.query.id;
        const VitalSign = await VitalSign.findById(VitalSign_id);
        res.status(200).json(VitalSign);
    } catch (error) {
        Err("could not get the VitalSign please try again", 500)
    }
}


const getAllVitalSigns = async (req, res) => {
    try {
        const VitalSigns = await VitalSign.find({});
        res.status(200).json(VitalSigns);
    } catch (error) {
        Err("could not get the VitalSigns please try again", 500)
    }
}

const updateVitalSign =async (req, res) => {
    try {
        const VitalSign_id = req.query.id;
        const VitalSign = await VitalSign.findById(VitalSign_id);
        if(!VitalSign) {
            Err("no VitalSign matches this id", 404);
        }
        await VitalSign.updateOne({$set: req.body});
        res.status(200).json("the VitalSign is updated succesfully");
    } catch (error) {
        Err("could not update the VitalSign, pls try again", 500)
    }
};


const deleteVitalSign =async (req, res) => {
    try {
        const VitalSign_id = req.query.id;
        const VitalSign = await VitalSign.deleteOne({_id: VitalSign_id});
        if(!VitalSign) {
            Err("no VitalSign matches this id", 404);
        }
        res.status(200).json("the VitalSign is deleted succesfully");
    } catch (error) {
        Err("could not delete the VitalSign, pls try again", 500)
    }
}




module.exports = {
    createVitalSign, getVitalSign, getAllVitalSigns, updateVitalSign, deleteVitalSign
}