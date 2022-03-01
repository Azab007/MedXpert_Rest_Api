const router = require('express').Router();
const {createDrug, getDrug, getAllDrugs, updateDrug, deleteDrug, addInteraction, deleteInteraction, addRestrictions, deleteRestrictions} = require('../controllers/drug.js');

router.route('/createDrug').post(createDrug);
router.route('/getDrug').get(getDrug);
router.route('/getAllDrugs').get(getAllDrugs);
router.route('/updateDrug').patch(updateDrug);
router.route('/addInteraction').patch(addInteraction);
router.route('/deleteInteraction').patch(deleteInteraction);
router.route('/addRestriction').patch(addRestrictions);
router.route('/deleteRestriction').patch(deleteRestrictions);
router.route('/deleteDrug').delete(deleteDrug);



module.exports = router;

