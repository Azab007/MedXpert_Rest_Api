const router = require('express').Router();
const { createVitalSign, getAllVitalSigns, getVitalSign, updateVitalSign, deleteVitalSign } = require('../controllers/vitalSigns.js');
const { authenticateUser, isPatient, isPatientorDoctor } = require('../middleware/authentication');
router.route('/createvitalSign').post(authenticateUser, isPatient, createVitalSign);
router.route('/getvitalSign').get(authenticateUser, isPatientorDoctor, getVitalSign);
router.route('/getAllvitalSigns').get(authenticateUser, getAllVitalSigns);
router.route('/updatevitalSign').patch(authenticateUser, isPatient, updateVitalSign);
router.route('/deletevitalSign').delete(authenticateUser, isPatient, deleteVitalSign);



module.exports = router;