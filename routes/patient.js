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
    getArticles
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
router.route("/articles").get(authenticateUser, isPatient, getArticles)






module.exports = router