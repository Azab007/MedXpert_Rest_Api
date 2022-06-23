const router = require('express').Router();
const { createVitalSign, getAllVitalSigns, getVitalSignDoctor, getVitalSignPatient, updateVitalSign, deleteVitalSign } = require('../controllers/vitalSigns/index.js');
const { authenticateUser, isPatient, isDoctor } = require('../middleware/authentication');
router.route('/createvitalSign').post(authenticateUser, isPatient, createVitalSign);
router.route('/getvitalSignPatient').get(authenticateUser, isPatient, getVitalSignPatient);
router.route('/getVitalSignDoctor').get(authenticateUser, isDoctor, getVitalSignDoctor);
router.route('/getAllvitalSigns').get(authenticateUser, getAllVitalSigns);
router.route('/updatevitalSign').patch(authenticateUser, isPatient, updateVitalSign);
router.route('/deletevitalSign').delete(authenticateUser, isPatient, deleteVitalSign);



module.exports = router;