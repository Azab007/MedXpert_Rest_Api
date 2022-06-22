const Patient = require('../../models/Patient.js');
const Doctor = require('../../models/Doctor.js');
const Pharma_Inc = require('../../models/Pharma_Inc.js');
const { BadRequestError } = require('../../errors')
const PasswordResetToken = require("../../models/PasswordResetToken.js");
const sendEmail = require("../utils/sendMail.js");
const bcrypt = require('bcrypt');
const Crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
var generator = require('generate-password');

const passwordReset = async(req, res) => {
    const { email, role } = req.body
    let user;

    let dbConnection;
    switch (role) {
        case 'patient':
            dbConnection = Patient;
            break;
        case 'doctor':
            dbConnection = Doctor;
            break;
        case 'pharma_inc':
            dbConnection = Pharma_Inc;
            break;
        default:
            throw new BadRequestError("undefined role");
    }

    user = await dbConnection.findOne({ email: email });


    if (!user)
        throw new BadRequestError('email does not exists');

    if (!user.verified) {
        throw new BadRequestError('Please verify your email first');
    }

    let token = await PasswordResetToken.findOne({ id: user._id });
    if (!token) {
        token = await new PasswordResetToken({
            id: user._id,
            Token: Crypto.randomBytes(32).toString("hex"),
            role: role
        }).save();
    }
    const link = `http://localhost:8000/api/auth/passwordReset/${token.Token}`;
    const text = `to Reset your Password please click <a href=${link}"> here</a>`
    await sendEmail(user.email, "Password reset", text);
    res.status(StatusCodes.OK).json({ msg: "password reset link sent to your email account" });

};

const ConfirmPasswordReset = async(req, res) => {
    const tk = req.params.token;

    const token = await PasswordResetToken.findOne({
        token: tk,
    });
    let user;
    if (!token) throw new BadRequestError("Link expired or does not exists");

    let dbConnection;
    switch (token.role) {
        case 'patient':
            dbConnection = Patient;
            break;
        case 'doctor':
            dbConnection = Doctor;
            break;
        case 'pharma_inc':
            dbConnection = Pharma_Inc;
            break;
        default:
            throw new BadRequestError("undefined role");
    }

    user = await dbConnection.findOne({ _id: token.id });

    var password = generator.generate({
        length: 15,
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: false
    });
    const hasedPassword = await bcrypt.hash(password, 12);
    user.password = hasedPassword;
    await user.save();
    await token.delete();

    let text = `<h2> Your new Password is "${password}"`
    await sendEmail(user.email, 'New Password', text);
    console.log(password, hasedPassword)
    res.status(StatusCodes.OK).send(`check Your inbox for your new Password`);
};

module.exports = { passwordReset, ConfirmPasswordReset }