const router = require('express').Router();
const {createVitalSign, getAllVitalSigns, getVitalSign, updateVitalSign, deleteVitalSign} = require('../controllers/vitalSigns.js');

router.route('/createvitalSign').post(createVitalSign);
router.route('/getvitalSign').get(getVitalSign);
router.route('/getAllvitalSigns').get(getAllVitalSigns);
router.route('/updatevitalSign').patch(updateVitalSign);
router.route('/deletevitalSign').delete(deleteVitalSign);



module.exports = router;

