const router = require('express').Router();
const { createVitalSign, getAllVitalSigns, getVitalSign, updateVitalSign, deleteVitalSign } = require('../controllers/vitalSigns.js');
const { authenticateUser, isPatient, isPatientorDoctor } = require('../middleware/authentication');
router.route('/createvitalSign').post(authenticateUser, isPatientorDoctor, createVitalSign);
router.route('/getvitalSign').get(authenticateUser, getVitalSign);
router.route('/getAllvitalSigns').get(authenticateUser, getAllVitalSigns);
router.route('/updatevitalSign').patch(authenticateUser, isPatientorDoctor, updateVitalSign);
router.route('/deletevitalSign').delete(authenticateUser, isPatientorDoctor, deleteVitalSign);



module.exports = router;