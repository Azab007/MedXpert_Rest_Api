const { register } = require('./register.js')
const { login } = require('./login.js')
const { logout } = require('./logout')
const { mailVerification } = require('./mailVerification')
const { passwordReset, ConfirmPasswordReset } = require('./passwordReset')




module.exports = {
    register,
    login,
    logout,
    mailVerification,
    passwordReset,
    ConfirmPasswordReset
}