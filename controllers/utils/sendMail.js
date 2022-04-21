const nodemailer = require("nodemailer");
const { BadRequestError } = require("../../errors");

const sendEmail = async(email, subject, text) => {
    try {
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
            subject: subject,
            html: text,
        };
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                res.json(err);
            } else {
                res.json(info);
            }
        });
    } catch (error) {
        throw new BadRequestError("something went wrong");
    }
};

module.exports = sendEmail;