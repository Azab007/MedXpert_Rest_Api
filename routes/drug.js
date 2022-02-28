const router = require('express').Router();
const {createDrug, getDrug, getAllDrugs, updateDrug, deleteDrug, addInteraction, deleteInteraction, addRestrictions, deleteRestrictions} = require('../controllers/drug.js');

router.route('/createDrug').post(createDrug);
router.route('/getDrug').get(getDrug);
router.route('/getAllDrugs').get(getAllDrugs);
router.route('/updateDrug').post(updateDrug);
router.route('/addInteraction').post(addInteraction);
router.route('/deleteInteraction').post(deleteInteraction);
router.route('/addRestriction').post(addRestrictions);
router.route('/deleteRestriction').post(deleteRestrictions);
router.route('/deleteDrug').delete(deleteDrug);



module.exports = router;

