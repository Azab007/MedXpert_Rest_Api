const VitalSign = require('../models/VitalSigns.js')
const {Err} = require('../middleware/throw_error.js');
const { default: mongoose } = require('mongoose');

const createVitalSign = async (req, res) => {
        const newVitalSign = new VitalSign({
            ...req.body
        });

        await newVitalSign.save();
        res.status(201).json(newVitalSign);
  
}

const getVitalSign = async(req, res) => {
        const VitalSign_id = req.query.id;
        const vitalSign = await VitalSign.findById(VitalSign_id);
        res.status(200).json(vitalSign);
    
}


const getAllVitalSigns = async (req, res) => {
        const VitalSigns = await VitalSign.find({});
        res.status(200).json(VitalSigns);
    
}

const updateVitalSign =async (req, res) => {
        const VitalSign_id = req.query.id;
        const vitalSign = await VitalSign.findByIdAndUpdate(VitalSign_id,{$set: req.body}, { runValidators: true, new: true });
        if(!vitalSign) {
            Err("no VitalSign matches this id", 404);
        }
        
        res.status(200).json({vitalSign,msg:"the VitalSign is updated succesfully"});
    
};


const deleteVitalSign =async (req, res) => {
        const VitalSign_id = req.query.id;
        const vitalSign = await VitalSign.findByIdAndRemove(VitalSign_id);
        if(!vitalSign) {
            Err("no VitalSign matches this id", 404);
        }
        res.status(200).json({msg:"the VitalSign is deleted succesfully"});
    
}




module.exports = {
    createVitalSign, getVitalSign, getAllVitalSigns, updateVitalSign, deleteVitalSign
}