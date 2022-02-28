const router = require('express').Router();
const {createMedication, getMedication, getAllMedications, updateMedication, deleteMedication, addInteraction, deleteInteraction, addRestrictions, deleteRestrictions} = require('../controllers/Medication.js');

router.route('/createMedication').post(createMedication);
router.route('/getMedication').get(getMedication);
router.route('/getAllMedications').get(getAllMedications);
router.route('/updateMedication').post(updateMedication);
router.route('/deleteMedication').delete(deleteMedication);



module.exports = router;

