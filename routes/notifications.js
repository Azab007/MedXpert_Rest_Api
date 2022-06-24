const router = require('express').Router();
const { createNotification, getNotification, deleteNotification, deleteNotificationByDrugUniqueId } = require('../controllers/notification.js');
const { authenticateUser, isPatient } = require('../middleware/authentication');
router.route('/createNotification').post(authenticateUser, isPatient, createNotification);
router.route('/getNotifications').get(authenticateUser, isPatient, getNotification);
router.route('/deleteNotification').post(authenticateUser, isPatient, deleteNotification);
router.route('/deleteNotificationByDrugUniqueId').delete(authenticateUser, isPatient, deleteNotificationByDrugUniqueId);




module.exports = router;