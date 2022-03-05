const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Patient = require('../models/Patient.js');
const Doctor = require('../models/Doctor.js');
const Pharma_Inc = require('../models/Pharma_Inc.js');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors')
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
        res.status(StatusCodes.CREATED).json({ "msg": "success" });
    } else if (role === 'doctor') {
        const newDoctor = new Doctor({
            ...req.body,
            password: hasedPassword

        });

        await newDoctor.save();
        res.status(StatusCodes.CREATED).json({ "msg": "success" });
    } else if (role === 'pharma_inc') {
        const newPharma = new Pharma_Inc({
            ...req.body,
            password: hasedPassword

        });

        await newPharma.save();
        res.status(StatusCodes.CREATED).json({ "msg": "success" });
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
        throw new BadRequestError("undefined role")
    }


    if (!loaded) {
        throw new NotFoundError("account not found")
    }

    const validPassword = await bcrypt.compare(password, loaded.password);
    if (!validPassword) {
        throw new UnauthenticatedError('Wrong password!');
    }
    const token = jwt.sign({
            email: loaded.email,
            userId: loaded._id.toString(),
            role: role
        },
        process.env.jwt_secret_key, { expiresIn: '30d' }
    );

    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
    res.status(StatusCodes.OK).json({ "msg": "success", token });

}


const logout = async(req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};



module.exports = {
    register,
    login,
    logout
}