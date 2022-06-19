const router = require('express').Router();
const { createNotification, getNotification, deleteNotification } = require('../controllers/notification.js');
const { authenticateUser, isPatient } = require('../middleware/authentication');
router.route('/createNotification').post(authenticateUser, isPatient, createNotification);
router.route('/getNotfications').get(authenticateUser, isPatient, getNotification);
router.route('/deleteNotification').delete(authenticateUser, isPatient, deleteNotification);



module.exports = router;