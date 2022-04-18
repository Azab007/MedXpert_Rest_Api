const mongoose = require('mongoose');
//const Doctor = require('./Doctor.js');

const DoctorSchema = new mongoose.Schema({

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
    specialization: [{
        type: String,
        enum: [],
        required: true
    }],

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },


    residency: {
        type: String
    },

    bio: {
        type: String
    },

    followings: [{
        patient_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Patient',
            required: true
        },
        date: { type: Date, default: Date.now },
        _id: false
    }]





}, { timestamps: true, })


module.exports = mongoose.model('Doctor', DoctorSchema);