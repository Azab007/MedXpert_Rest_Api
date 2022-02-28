const router = require('express').Router();
const { getDoc, getAllDoc, deleteDoc } = require('../controllers/doctor.js')


router.route('/getDoctor').get(getDoc)
router.route('/getAllDoctors').get(getAllDoc)
router.route('/deleteDoctor').delete(deleteDoc)



module.exports = router