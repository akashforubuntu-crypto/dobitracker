const express = require('express');
const router = express.Router();
const { 
  uploadNotifications, 
  fetchNotifications 
} = require('../controllers/notificationController');

// Upload notifications route
router.post('/upload-notifications', uploadNotifications);

// Fetch notifications route
router.get('/fetch-notifications', fetchNotifications);

module.exports = router;
