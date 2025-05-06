const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authmiddleware');

// Route to register a new user
router.post('/register', authController.register);
// Route to login a user
router.post('/login', authController.login);
// Route to get user details
router.get('/userconnect', authMiddleware, authController.userConnect);


module.exports = router