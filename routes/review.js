const router = require('express').Router();
const {
    add,
    update,
    remove,
    get
} = require('../controllers/review')


router.route('/add').post(add)
router.route('/update').post(update)
router.route('/remove').delete(remove)
router.route('/:drug_id').get(get)


module.exports = router