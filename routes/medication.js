const router = require('express').Router();
const {
    createMedication,
    getMedication,
    getAllMedications,
    updateMedication,
    deleteMedication,
    addMedicationDrug,
    deleteMedicationDrug,
    getFollowingMedication
} = require('../controllers/Medication.js');
const { isDoctor, isPatient, authenticateUser, isPatientorDoctor } = require('../middleware/authentication.js')
router.route('/createMedication').post(authenticateUser, isDoctor, createMedication);
router.route('/getMedication').get(authenticateUser, isPatientorDoctor, getMedication);
router.route('/getAllMedications').get(authenticateUser, getAllMedications);
router.route('/updateMedication').patch(authenticateUser, isDoctor, updateMedication);
router.route('/addMedicationDrug').patch(authenticateUser, isDoctor, addMedicationDrug);
router.route('/deleteMedicationDrug').patch(authenticateUser, isDoctor, deleteMedicationDrug);
router.route('/deleteMedication').delete(authenticateUser, isDoctor, deleteMedication);
router.route('/getFollowingMedication').get(authenticateUser, isPatient, getFollowingMedication);



module.exports = router;