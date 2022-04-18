const mongoose = require('mongoose');

const Pharma_IncSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    Location: {
        type: String
    },



}, { timestamps: true })

module.exports = mongoose.model('Pharma_Inc', Pharma_IncSchema);