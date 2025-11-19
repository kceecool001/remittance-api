const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validation'); // FIXED
const rateLimit = require('express-rate-limit');

// Rate limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts. Please try again later.'
});

// REGISTER
router.post('/register', validateRegistration, authController.register);

// LOGIN (no validation provided yet, so remove validateLogin)
router.post('/login', loginLimiter, authController.login);

// REFRESH TOKEN
router.post('/refresh', authController.refreshToken);

// LOGOUT
router.post('/logout', authController.logout);

module.exports = router;
