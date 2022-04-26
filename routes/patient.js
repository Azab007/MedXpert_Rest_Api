const router = require('express').Router();
const {
    getPatient,
    getAllpatients,
    updatePatient,
    addToList,
    deleteFromList,
    deletePatient,
    createInvitation,
    useInvitation,
    getArticles,
    deleteDoctorFromPatient,
    deleteFollowerFromPatient,
    deleteFollowingFromPatient
} = require('../controllers/patient')

const {
    authenticateUser,
    isPatient,
    isPatientorDoctor,
    isDoctor
} = require('../middleware/authentication')


router.route('/getPatient').get(authenticateUser, isPatientorDoctor, getPatient)
router.route('/getAllPatients').get(authenticateUser, isDoctor, getAllpatients)
router.route("/updatePatient").patch(authenticateUser, isPatient, updatePatient)
router.route("/addToList").patch(authenticateUser, isPatientorDoctor, addToList)
router.route("/deleteFromList").patch(authenticateUser, isPatient, deleteFromList)
router.route("/deletePatient").delete(authenticateUser, isPatient, deletePatient)
router.route("/createInvitation").get(authenticateUser, isPatient, createInvitation)
router.route("/useInvitation").post(authenticateUser, isPatient, useInvitation)
router.route("/articles").get(authenticateUser, isPatientorDoctor, getArticles)
router.route("/deleteDoctorFromPatient").patch(authenticateUser, isPatient, deleteDoctorFromPatient)
router.route("/deleteFollowerFromPatient").patch(authenticateUser, isPatient, deleteFollowerFromPatient)
router.route("/deleteFollowingFromPatient").patch(authenticateUser, isPatient, deleteFollowingFromPatient)








module.exports = router