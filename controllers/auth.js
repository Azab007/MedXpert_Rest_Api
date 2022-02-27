const { default: mongoose } = require("mongoose");
const Doctor = require("../models/Doctor.js");
const Drug = require("../models/Drug.js");
const Patient = require("../models/Patient.js")

register = async (req, res) => {
    const user = await  Patient.create({...req.body})
    res.json({user})    
}

// just for testing
getall = async (req, res) => {
    const data = await Patient.find({})
    res.json({data})
}







module.exports = {
    register, getall
}