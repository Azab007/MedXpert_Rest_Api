const mongoose = require('mongoose');
const _ = require('underscore');

const DrugSchema = new mongoose.Schema({

    Inc_id: {
        type: mongoose.Types.ObjectId, ref: 'Pharma_Inc',
         required: true
    },
    drugName: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
    },
    indicationofuse: {
        type: String,
    },

    description: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },

    overdose: {
        type: mongoose.Types.Decimal128
    },
    more: {
        type: String
    },

    interactions: [{drug_id:{
        type: mongoose.Types.ObjectId, required: true, ref: 'Drug'

    }, description: {
        type: String,
        required: true
    },
    level: {
        type: String
    },
    _id : false}],

    restrictions: [{condition_name:{
        type: String,
        required: true
        

    }, description: {
        type: String,
        required: true
    },
    level: {
        type: String
    },
    _id : false
    }]





},
{timestamps: true}
)


module.exports = mongoose.model('Drug', DrugSchema);