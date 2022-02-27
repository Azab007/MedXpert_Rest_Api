const router = require('express').Router();
const {register,getall} = require('../controllers/auth.js');

router.route('/register').post(register).get(getall)

module.exports = router;

