const router = require('express').Router();
const {createDrug, getDrug, getAllDrugs, updateDrug, deleteDrug, addToList, deleteFromList} = require('../controllers/drug.js');

router.route('/createDrug').post(createDrug);
router.route('/getDrug').get(getDrug);
router.route('/getAllDrugs').get(getAllDrugs);
router.route('/updateDrug').patch(updateDrug);
router.route('/addToList').patch(addToList);
router.route('/deleteFromList').patch(deleteFromList);
router.route('/deleteDrug').delete(deleteDrug);



module.exports = router;

