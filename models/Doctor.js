const mongoose = require('mongoose');
//const Doctor = require('./Doctor.js');
const arrayUniquePlugin = require('mongoose-unique-array'); 

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
        required: true,
        unique: true
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

DoctorSchema.plugin(arrayUniquePlugin);

module.exports = mongoose.model('Doctor', DoctorSchema);