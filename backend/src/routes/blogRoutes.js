const express = require('express');
const router = express.Router();
const { 
  createBlogHandler,
  getAllBlogsHandler,
  getBlog,
  updateBlogHandler,
  deleteBlogHandler
} = require('../controllers/blogController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Public routes for fetching blogs
router.get('/', getAllBlogsHandler);
router.get('/:id', getBlog);

// Admin routes for managing blogs (require authentication and admin role)
router.post('/', authenticate, authorizeAdmin, createBlogHandler);
router.put('/:id', authenticate, authorizeAdmin, updateBlogHandler);
router.delete('/:id', authenticate, authorizeAdmin, deleteBlogHandler);

module.exports = router;
