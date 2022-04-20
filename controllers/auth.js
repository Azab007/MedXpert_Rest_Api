const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Patient = require('../models/Patient.js');
const Doctor = require('../models/Doctor.js');
const Pharma_Inc = require('../models/Pharma_Inc.js');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const nodemailer = require("nodemailer");
const Invitations = require('../models/VerificationToken.js')
const Crypto = require('crypto')

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

    let id;

    if (role === 'patient') {
        const newPatient = new Patient({
            ...req.body,
            password: hasedPassword

        });

        await newPatient.save();
        id = newPatient._id

    } else if (role === 'doctor') {
        const newDoctor = new Doctor({
            ...req.body,
            password: hasedPassword

        });

        await newDoctor.save();
        id = newDoctor._id

    } else if (role === 'pharma_inc') {
        const newPharma = new Pharma_Inc({
            ...req.body,
            password: hasedPassword

        });

        await newPharma.save();
    } else {
        throw new BadRequestError("unknown role")
    }


    const Token = Crypto
        .randomBytes(24)
        .toString('base64')
        .slice(0, 24) //generate random token
        // console.log(Token)
    const tokenData = new Invitations({
        Token,
        id,
        isPatient: role === 'patient'
    })
    await tokenData.save()

    sendVerification(req.body.email, Token)
    res.status(StatusCodes.CREATED).json({ "msg": "success" });


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

const mailVerification = async(req, res) => {
    const code = req.query.code
        // check in data
    let tokenData = await Invitations.findOneAndDelete({ token: code })

    if (!tokenData) {
        throw new NotFoundError("expired token")
    }
    if (tokenData.isPatient) {
        const patient = await Patient.findByIdAndUpdate(tokenData.id, {
                verified: true
            }, { runValidators: true, new: true })
            // console.log(patient)
    } else {
        const doc = await Doctor.findByIdAndUpdate(tokenData.id, {
                verified: true
            }, { runValidators: true, new: true })
            // console.log(doc)
    }


    res.status(StatusCodes.OK).json({ "msg": "mail activated" })

}


async function sendVerification(email, code) {
    // let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.projMail,
            pass: process.env.mailPassword,
        },
    });


    let mailOptions = {
        from: `"no reply" <${process.env.projMail}>`,
        to: email,
        subject: `mail activation`,
        html: `to activate your account please click here <a href="http://localhost:8000/api/auth/mailVerification?code=${code}">click here</a> `,
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            res.json(err);
        } else {
            res.json(info);
        }
    });
}




module.exports = {
    register,
    login,
    logout,
    mailVerification
}