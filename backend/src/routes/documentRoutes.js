const express = require('express');
const router = express.Router();
const { 
  createDocumentHandler,
  getDocument,
  getAllDocumentsHandler,
  updateDocumentHandler,
  deleteDocumentHandler
} = require('../controllers/documentController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Public routes for fetching documents
router.get('/', getAllDocumentsHandler);
router.get('/:type', getDocument);

// Admin routes for managing documents (require authentication and admin role)
router.post('/', authenticate, authorizeAdmin, createDocumentHandler);
router.put('/:id', authenticate, authorizeAdmin, updateDocumentHandler);
router.delete('/:id', authenticate, authorizeAdmin, deleteDocumentHandler);

module.exports = router;
