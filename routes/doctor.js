const router = require('express').Router();
const {
    getDoc,
    getAllDoc,
    deleteDoc,
    addSpecialization,
    deleteSpecialization,
    update
} = require('../controllers/doctor.js')


router.route('/getDoctor').get(getDoc)
router.route('/getAllDoctors').get(getAllDoc)
router.route('/deleteDoctor').delete(deleteDoc)
router.route('/addSpecialization').patch(addSpecialization)
router.route('/deleteSpecialization').patch(deleteSpecialization)
router.route('/update').patch(update)



module.exports = router