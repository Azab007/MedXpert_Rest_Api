const router = require('express').Router();
const {
    addReview,
    updateReview,
    removeReview,
    getReview
} = require('../controllers/review')


router.route('/createReview').post(addReview)
router.route('/updateReview').patch(updateReview)
router.route('/deleteReview').delete(removeReview)
router.route('/getReview').get(getReview)


module.exports = router