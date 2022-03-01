const Pharma_inc = require('../models/Pharma_Inc.js')
const {Err} = require('../middleware/throw_error.js');
const { default: mongoose } = require('mongoose');


const getPharma = async(req, res) => {
        const Pharma_id = req.query.id;
        const Pharma = await Pharma_inc.findById(Pharma_id);
        res.status(200).json(Pharma);
   
}


const getAllPharmas = async (req, res) => {
        const Pharmas = await Pharma_inc.find({});
        res.status(200).json(Pharmas);
   
}

const updatePharma =async (req, res) => {
        const Pharma_id = req.query.id;
        const {email, username, Location} = req.body
        const Pharma = await Pharma_inc.findByIdAndUpdate(Pharma_id, {$set: {email, username, Location}} , { runValidators: true, new: true });
        if(!Pharma) {
           throw Err("no Pharma matches this id", 404);
        }
 
        res.status(200).json({Pharma, msg:"the Pharma is updated succesfully"});
};


const deletePharma =async (req, res) => {
    
        const Pharma_id = req.query.id;
        const Pharma = await Pharma_inc.findByIdAndRemove(Pharma_id, { runValidators: true, new: true });
        if(!Pharma) {
           throw Err("no Pharma matches this id", 404);
        }
            res.status(200).json({msg:"the Pharma is deleted succesfully"});

        
    
}




module.exports = {
     getPharma, getAllPharmas, updatePharma, deletePharma
};