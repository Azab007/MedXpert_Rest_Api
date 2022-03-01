const router = require('express').Router();
const {
    add,
    update,
    remove,
    get
} = require('../controllers/review')


router.route('/createReview').post(add)
router.route('/updateReview').patch(update)
router.route('/deleteReview').delete(remove)
router.route('/getReview/:drug_id').get(get)


module.exports = router