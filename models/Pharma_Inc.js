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
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Minimum eight characters, at least one uppercase letter,\
        one lowercase letter, one number and one special character"],
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