const express = require('express');
const router = express.Router();
const { 
  getAllUsers,
  getUserById,
  updateUserRole,
  getDeviceStatus,
  getNotificationsForUser,
  deleteUser
} = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Admin routes (all require authentication and admin role)
router.get('/users', authenticate, authorizeAdmin, getAllUsers);
router.get('/users/:id', authenticate, authorizeAdmin, getUserById);
router.put('/users/:id/role', authenticate, authorizeAdmin, updateUserRole);
router.delete('/users/:id', authenticate, authorizeAdmin, deleteUser);
router.get('/devices', authenticate, authorizeAdmin, getDeviceStatus);
router.get('/notifications/:deviceId', authenticate, authorizeAdmin, getNotificationsForUser);

module.exports = router;
