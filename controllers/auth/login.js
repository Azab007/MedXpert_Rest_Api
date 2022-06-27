const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../../models/Patient.js');
const Doctor = require('../../models/Doctor.js');
const Pharma_Inc = require('../../models/Pharma_Inc.js');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../../errors')
const { StatusCodes } = require('http-status-codes');
const VerificationToken = require('../../models/VerificationToken')
const sendEmail = require("../utils/sendMail.js");
const Crypto = require('crypto');

async function sendVerification(email, code) {
    // let testAccount = await nodemailer.createTestAccount();
    let text = `to activate your account please click <a href="http://localhost:8000/api/auth/mailVerification?code=${code}"> here</a> `
    sendEmail(email, `mail activation`, text);
}



exports.login = async(req, res, next) => {

    const { email, password, role } = req.body

    let loaded;
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

    loaded = await dbConnection.findOne({ email: email });
    if (!loaded) {
        throw new NotFoundError("account not found")
    }

    const validPassword = await bcrypt.compare(password, loaded.password);
    if (!validPassword) {
        throw new UnauthenticatedError('Wrong password!');
    }
    let token
    await VerificationToken.deleteOne({id: loaded._id})
    if (!loaded.verified) {
        token = null
        const Token = Crypto
        .randomBytes(24)
        .toString('base64')
        .slice(0, 24)

    const tokenData = new VerificationToken({
        Token,
        id: loaded._id,
        isPatient: role === 'patient'
    })

    await tokenData.save()

    sendVerification(req.body.email, Token)
    } else {
        token = jwt.sign({
                email: loaded.email,
                userId: loaded._id.toString(),
                role: role
            },
            process.env.jwt_secret_key, { expiresIn: '30d' }
        );
    }


    res.status(StatusCodes.OK).json({ "msg": "success", token });

}