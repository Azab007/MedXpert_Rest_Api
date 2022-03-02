const router = require('express').Router();
const {
    addReview,
    updateReview,
    removeReview,
    getReview
} = require('../controllers/review')

const {
    authenticateUser,
    isPatient
} = require('../middleware/authentication')

router.route('/createReview').post(authenticateUser, isPatient, addReview)
router.route('/updateReview').patch(authenticateUser, isPatient, updateReview)
router.route('/deleteReview').delete(authenticateUser, isPatient, removeReview)
router.route('/getReview').get(authenticateUser, getReview)


module.exports = router