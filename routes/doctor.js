const router = require('express').Router();
const {
    getDoc,
    getAllDoc,
    deleteDoc,
    addSpecialization,
    deleteSpecialization,
    updateDoc
} = require('../controllers/doctor.js')


router.route('/getDoctor').get(getDoc)
router.route('/getAllDoctors').get(getAllDoc)
router.route('/deleteDoctor').delete(deleteDoc)
router.route('/addSpecialization').patch(addSpecialization)
router.route('/deleteSpecialization').patch(deleteSpecialization)
router.route('/updateDoc').patch(updateDoc)



module.exports = router