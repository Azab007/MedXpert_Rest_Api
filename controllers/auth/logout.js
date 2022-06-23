const { default: mongoose } = require("mongoose");
const { StatusCodes } = require('http-status-codes');

exports.logout = async(req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};