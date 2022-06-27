const router = require('express').Router();
const {
    getDoc,
    getAllDoc,
    deleteDoc,
    addSpecialization,
    deleteSpecialization,
    updateDoc,
    useInvitation,
    deletePatientFromDoctor,
    getArticles
} = require('../controllers/doctor.js')

const {
    authenticateUser,
    isDoctor,
    isPatientorDoctor
} = require('../middleware/authentication')

router.route('/getDoctor').get(authenticateUser, isPatientorDoctor, getDoc)
router.route('/getAllDoctors').get(authenticateUser, getAllDoc)
router.route('/deleteDoctor').delete(authenticateUser, isDoctor, deleteDoc)
router.route('/addSpecialization').patch(authenticateUser, isDoctor, addSpecialization)
router.route('/deleteSpecialization').patch(authenticateUser, isDoctor, deleteSpecialization)
router.route('/updateDoc').patch(authenticateUser, isDoctor, updateDoc)
router.route('/useInvitation').post(authenticateUser, isDoctor, useInvitation)
router.route('/deletePatientFromDoctor').patch(authenticateUser, isDoctor, deletePatientFromDoctor)




module.exports = router