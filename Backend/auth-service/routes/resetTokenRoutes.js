const express = require('express');
const router = express.Router();
const resetTokenController  = require('../controllers/resetTokenController');


// routes/authRoutes.js
router.post('/forgot-password', resetTokenController.requestPasswordReset);
router.post('/reset-password/:token', resetTokenController.resetPassword);


module.exports = router;