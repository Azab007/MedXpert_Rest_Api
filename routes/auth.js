const router = require('express').Router();
const { register, login, logout, mailVerification, passwordReset, ConfirmPasswordReset } = require('../controllers/auth.js');

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/mailVerification').get(mailVerification)
router.route('/passwordReset').post(passwordReset)
router.route('/passwordReset/:token').get(ConfirmPasswordReset)


module.exports = router;