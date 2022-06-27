const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Patient = require('../../models/Patient.js');
const Doctor = require('../../models/Doctor.js');
const Pharma_Inc = require('../../models/Pharma_Inc.js');
const { BadRequestError } = require('../../errors')
const { StatusCodes } = require('http-status-codes');
const VerificationToken = require('../../models/VerificationToken')
const sendEmail = require("../utils/sendMail.js");
const Crypto = require('crypto');




const regPatient = async(data) => {
    const patient = await Patient.findOne({ email: data.email })
    if (patient) {
        throw new BadRequestError("email already exists, please choose another one")
    }
    const newPatient = new Patient(data);
    await newPatient.save();
    return newPatient._id
}

const regDoctor = async(data) => {
    const doctor = await Doctor.findOne({ email: data.email })
    if (doctor) {
        throw new BadRequestError("email already exists, please choose another one")
    }
    const newDoctor = new Doctor(data);
    await newDoctor.save();
    return newDoctor._id
}


const regPharma = async(data) => {
    const newPharma = new Pharma_Inc(data);
    await newPharma.save();
    return newDoctor._id
}

async function sendVerification(email, code) {
    // let testAccount = await nodemailer.createTestAccount();
    let text = `to activate your account please click <a href="http://localhost:8000/api/auth/mailVerification?code=${code}"> here</a> `
    sendEmail(email, `mail activation`, text);
}



exports.register = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new BadRequestError("data are invalid")
    }
    const { role } = req.body;
    const matched = req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

    if (!matched) {
        throw new BadRequestError("password should be Minimum eight characters, at least one uppercase letter,\
         one lowercase letter, one number and one special character");
    }
    const hasedPassword = await bcrypt.hash(req.body.password, 12);

    let id;
    let _data = {...req.body, password: hasedPassword };


    switch (role) {
        case 'patient':
            id = await regPatient(_data);
            break;
        case 'doctor':
            id = await regDoctor(_data);
            break;
        case 'pharma_inc':
            id = await regPharma(_data);
            break
        default:
            throw new BadRequestError("unknown role");
    }


    const Token = Crypto
        .randomBytes(24)
        .toString('base64')
        .slice(0, 24)


    const tokenData = new VerificationToken({
        Token,
        id,
        isPatient: role === 'patient'
    })

    await tokenData.save()

    sendVerification(req.body.email, Token)
    res.status(StatusCodes.CREATED).json({ "msg": "success" });


}