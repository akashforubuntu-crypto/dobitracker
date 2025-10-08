const express = require('express');
const router = express.Router();
const { 
  signup, 
  verifyOTP, 
  login, 
  requestPasswordReset, 
  verifyPasswordResetOTP, 
  resetPassword,
  verifyDevice
} = require('../controllers/authController');

// Signup routes
router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);

// Login route
router.post('/login', login);

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/verify-password-reset-otp', verifyPasswordResetOTP);
router.post('/reset-password', resetPassword);

// Device verification route
router.post('/verify-device', verifyDevice);

module.exports = router;
