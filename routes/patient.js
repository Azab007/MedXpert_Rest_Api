const router = require('express').Router();
const {
    getPatient,
    getAllpatients,
    update,
    add,
    remove
} = require('../controllers/patient')


router.route('/getPatient').get(getPatient)
router.route('/getAllPatients').get(getAllpatients)
router.route("/update").patch(update)
router.route("/add").patch(add)
router.route("/remove").patch(remove)





module.exports = router