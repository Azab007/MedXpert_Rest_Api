const router = require('express').Router();
const {register} = require('../controllers/auth.js');

router.get('/', register)

module.exports = router;

