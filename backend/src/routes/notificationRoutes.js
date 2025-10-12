const express = require('express');
const router = express.Router();
const { 
  uploadNotifications, 
  fetchNotifications 
} = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

// Upload notifications route (no auth needed - Android app uploads)
router.post('/upload-notifications', uploadNotifications);

// Fetch notifications route (requires authentication)
router.get('/fetch-notifications', authenticate, fetchNotifications);

module.exports = router;
