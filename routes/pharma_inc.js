const router = require('express').Router();
const { getPharma, getAllPharmas, updatePharma, deletePharma, } = require('../controllers/pharma_inc.js');
const { authenticateUser, isPharma } = require('../middleware/authentication');
router.route('/getPharma').get(authenticateUser, getPharma);
router.route('/getAllPharmas').get(authenticateUser, getAllPharmas);
router.route('/updatePharma').patch(authenticateUser, isPharma, updatePharma);
router.route('/deletePharma').delete(authenticateUser, isPharma, deletePharma);



module.exports = router;