const router = require('express').Router();
const { register, login, logout, mailVerification } = require('../controllers/auth.js');

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/mailVerification').get(mailVerification)

module.exports = router;