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
router.route("/update").post(update)
router.route("/add").patch(add)
router.route("/remove").patch(remove)
router.route("/removePatient").delete(deletePatient)






module.exports = router