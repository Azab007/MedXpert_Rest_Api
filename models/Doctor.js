const mongoose = require('mongoose');
//const Doctor = require('./Doctor.js');

const DoctorSchema = new mongoose.Schema({

    email: {
        type:String,
        required: true,
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

    residency: {
        type: String
    },

    bio: {
        type: String
    },





},
{timestamps: true}
)


module.exports = mongoose.model('Doctor', DoctorSchema);