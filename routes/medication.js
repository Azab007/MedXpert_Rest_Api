const router = require('express').Router();
const {createMedication, getMedication, getAllMedications, updateMedication, deleteMedication, addMedicationDrug, deleteMedicationDrug} = require('../controllers/Medication.js');

router.route('/createMedication').post(createMedication);
router.route('/getMedication').get(getMedication);
router.route('/getAllMedications').get(getAllMedications);
router.route('/updateMedication').patch(updateMedication);
router.route('/addMedicationDrug').patch(addMedicationDrug);
router.route('/deleteMedicationDrug').patch(deleteMedicationDrug);
router.route('/deleteMedication').delete(deleteMedication);



module.exports = router;

