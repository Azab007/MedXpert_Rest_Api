const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../../models/Patient.js');
const Doctor = require('../../models/Doctor.js');
const Pharma_Inc = require('../../models/Pharma_Inc.js');
const { NotFoundError, BadRequestError, UnauthenticatedError } = require('../../errors')
const { StatusCodes } = require('http-status-codes');




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
    if (!loaded.verified) {
        token = null
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