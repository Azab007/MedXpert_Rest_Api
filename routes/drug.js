const router = require('express').Router();
const {createDrug, getDrug, getAllDrugs} = require('../controllers/drug.js');

router.route('/createDrug').post(createDrug);
router.route('/getDrug').get(getDrug);
router.route('/getAllDrugs').get(getAllDrugs);


module.exports = router;

