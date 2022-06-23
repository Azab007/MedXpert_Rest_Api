const Patient = require('../../models/Patient.js');
const Doctor = require('../../models/Doctor.js');
const { NotFoundError } = require('../../errors')
const { StatusCodes } = require('http-status-codes');
const VerificationToken = require('../../models/VerificationToken')





exports.mailVerification = async(req, res) => {
    const code = req.query.code
        // check in data
    let tokenData = await VerificationToken.findOneAndDelete({ token: code })
    if (!tokenData) {
        throw new NotFoundError("expired token")

    }

    if (tokenData.isPatient) {
        await Patient.findByIdAndUpdate(tokenData.id, {
            verified: true
        }, { runValidators: true, new: true })
    } else {
        await Doctor.findByIdAndUpdate(tokenData.id, {
            verified: true
        }, { runValidators: true, new: true })
    }


    res.status(StatusCodes.OK).json({ "msg": "mail activated" })

}