const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authmiddleware');

const purchaseController = require('../controllers/premiumController'); 

router.get('/purchase/buypremium', authenticate, purchaseController.buypremium);

router.post('/purchase/updatepremiummembers', authenticate, purchaseController.updatepremiumuser);

router.post('/purchase/updatepremiumuseronfailure', authenticate, purchaseController.updatepremiumuseronfailure);

module.exports = router;
