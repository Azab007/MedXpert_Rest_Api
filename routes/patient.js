const router = require('express').Router();
const {
    getPatient,
    getAllpatients,
    updatePatient,
    addToList,
    deleteFromList,
    deletePatient
} = require('../controllers/patient')


router.route('/getPatient').get(getPatient)
router.route('/getAllPatients').get(getAllpatients)
router.route("/updatePatient").patch(updatePatient)
router.route("/addToList").patch(addToList)
router.route("/deleteFromList").patch(deleteFromList)
router.route("/deletePatient").delete(deletePatient)






module.exports = router