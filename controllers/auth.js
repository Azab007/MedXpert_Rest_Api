const { register } = require('./auth/register.js')
const { login } = require('./auth/login.js')
const { logout } = require('./auth/logout')
const { mailVerification } = require('./auth/mailVerification')
const { passwordReset, ConfirmPasswordReset } = require('./auth/passwordReset')




module.exports = {
    register,
    login,
    logout,
    mailVerification,
    passwordReset,
    ConfirmPasswordReset
}