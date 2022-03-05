const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({

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
    birthDate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },

    weight: {
        type: mongoose.Types.Decimal128,
        max: 250
    },
    type: [{
        type: String
    }],
    residency: {
        type: String
    },

    followers: [{ type: mongoose.Types.ObjectId, ref: 'Patient' }],
    followings: [{ type: mongoose.Types.ObjectId, ref: 'Patient' }],

    clinicians: [{
        doctor_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Doctor'
        },
        date: { type: Date, default: Date.now },
        _id: false
    }],
    chronics: [{
        chronic_name: {
            type: String,
            required: true
        },
        since: {
            type: Date,

        },
        state: {
            type: String,
            enum: []

        },
        _id: false


    }]


}, { timestamps: true })

module.exports = mongoose.model('Patient', PatientSchema);