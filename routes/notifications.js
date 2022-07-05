const router = require('express').Router();
const { createNotification, getNotification, deleteNotification, deleteNotificationByDrugUniqueId } = require('../controllers/notification.js');
const { authenticateUser, isPatient, isPatientorDoctor } = require('../middleware/authentication');
router.route('/createNotification').post(authenticateUser, isPatient, createNotification);
router.route('/getNotifications').get(authenticateUser, isPatient, getNotification);
router.route('/deleteNotification').delete(authenticateUser, isPatientorDoctor, deleteNotification);
router.route('/deleteNotificationByDrugUniqueId').delete(authenticateUser, isPatientorDoctor, deleteNotificationByDrugUniqueId);




module.exports = router;