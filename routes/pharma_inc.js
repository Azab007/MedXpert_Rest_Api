const router = require('express').Router();
const {createPharma, getPharma, getAllPharmas, updatePharma, deletePharma, } = require('../controllers/pharma_inc.js');

router.route('/getPharma').get(getPharma);
router.route('/getAllPharmas').get(getAllPharmas);
router.route('/updatePharma').post(updatePharma);
router.route('/deletePharma').delete(deletePharma);



module.exports = router;

