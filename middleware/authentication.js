const CustomError = require('../errors');
const jwt = require('jsonwebtoken');

const authenticateUser = async(req, res, next) => {
    const token = req.signedCookies.token;

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



module.exports = {
    authenticateUser,
};