const express = require('express');
const router = express.Router();
const { contactOwner } = require('../controllers/emailController');

router.post('/contact', contactOwner);

module.exports = router;
