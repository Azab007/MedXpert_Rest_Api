const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

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
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Minimum eight characters, at least one uppercase letter,\
        one lowercase letter, one number and one special character"],
    },
    birthDate: {
        type: Date,
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },

    weight: {
        type: Double,
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
        doctor: {
            type: mongoose.Types.ObjectId,
            ref: 'Doctor',
            required: true
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