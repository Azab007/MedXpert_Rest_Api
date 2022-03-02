const router = require('express').Router();
const { createMedication, getMedication, getAllMedications, updateMedication, deleteMedication, addMedicationDrug, deleteMedicationDrug } = require('../controllers/Medication.js');
const { isDoctor, authenticateUser } = require('../middleware/authentication.js')
router.route('/createMedication').post(authenticateUser, isDoctor, createMedication);
router.route('/getMedication').get(authenticateUser, getMedication);
router.route('/getAllMedications').get(authenticateUser, getAllMedications);
router.route('/updateMedication').patch(authenticateUser, isDoctor, updateMedication);
router.route('/addMedicationDrug').patch(authenticateUser, isDoctor, addMedicationDrug);
router.route('/deleteMedicationDrug').patch(authenticateUser, isDoctor, deleteMedicationDrug);
router.route('/deleteMedication').delete(authenticateUser, isDoctor, deleteMedication);



module.exports = router;