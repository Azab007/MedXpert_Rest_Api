const router = require('express').Router();
const {
    getPatient,
    getAllpatients,
    update,
    add,
    remove,
    deletePatient
} = require('../controllers/patient')


router.route('/getPatient').get(getPatient)
router.route('/getAllPatients').get(getAllpatients)
router.route("/updatePatient").patch(update)
router.route("/addPatient").patch(add)
router.route("/remove").patch(remove)
router.route("/deletePatient").delete(deletePatient)






module.exports = router