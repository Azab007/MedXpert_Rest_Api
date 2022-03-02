const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Patient = require('../models/Patient.js');
const Doctor = require('../models/Doctor.js');
const Pharma_Inc = require('../models/Pharma_Inc.js');
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes');

const register = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new BadRequestError("data are invalid")
    }
    const { role } = req.body;
    const matched = req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);

    if (!matched) {
        throw new BadRequestError("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character");
    }
    const hasedPassword = await bcrypt.hash(req.body.password, 12);

    if (role === 'patient') {
        const newPatient = new Patient({
            ...req.body,
            password: hasedPassword

        });

        await newPatient.save();
        res.status(StatusCodes.CREATED).json({ "msg": "success", "data": newPatient });
    } else if (role === 'doctor') {
        const newDoctor = new Doctor({
            ...req.body,
            password: hasedPassword

        });

        await newDoctor.save();
        res.status(StatusCodes.CREATED).json({ "msg": "success", "data": newDoctor });
    } else if (role === 'pharma_inc') {
        const newPharma = new Pharma_Inc({
            ...req.body,
            password: hasedPassword

        });

        await newPharma.save();
        res.status(StatusCodes.CREATED).json({ "msg": "success", "data": newPharma });
    } else {
        throw new BadRequestError("unknown role")
    }

}


const login = async(req, res, next) => {

    const { email, password, role } = req.body

    let loaded;
    if (role === 'patient') {
        loaded = await Patient.findOne({ email: email });
    } else if (role === 'doctor') {
        loaded = await Doctor.findOne({ email: email });
    } else if (role === 'pharma_inc') {
        loaded = await Pharma_Inc.findOne({ email: email });
    } else {
        const error = new Error('Log in Failed.');
        error.statusCode = 422;
        throw error
    }


    try {

        if (!loaded) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error
        }

        const validPassword = await bcrypt.compare(password, loaded.password);
        if (!validPassword) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error

        }
        const token = jwt.sign({
                email: loaded.email,
                userId: loaded._id.toString(),
                role: role
            },
            process.env.jwt_secret_key, { expiresIn: '1h' }
        );
        res.status(200).json({ token: token, userId: loaded._id.toString() });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error
    }




}






module.exports = {
    register,
    login
}