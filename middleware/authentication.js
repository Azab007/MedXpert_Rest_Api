const CustomError = require('../errors');
const jwt = require('jsonwebtoken');

const authenticateUser = async(req, res, next) => {
    const token = req.headers["authorization"].split("Bearer ")[1];

    if (!token) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }

    try {
        const { email, userId, role } = jwt.verify(token, process.env.jwt_secret_key);
        req.user = { email, userId, role };
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
};

const isDoctor = (req, res, next) => {
    if (req.user.role === 'doctor') {
        next()
    } else {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
}

const isPatient = (req, res, next) => {
    if (req.user.role === 'patient') {
        next()
    } else {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
}

const isPatientorDoctor = (req, res, next) => {
    if (req.user.role === 'patient' || req.user.role === 'doctor') {
        next()
    } else {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
}

const isPharma = (req, res, next) => {
    if (req.user.role === 'pharma_inc') {
        next()
    } else {
        throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }
}


module.exports = {
    authenticateUser,
    isDoctor,
    isPatient,
    isPharma,
    isPatientorDoctor
};