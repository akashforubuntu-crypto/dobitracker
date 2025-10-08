const { 
  createDocument, 
  getDocumentByType, 
  getAllDocuments, 
  updateDocument, 
  deleteDocument 
} = require('../models/documentModel');

const createDocumentHandler = async (req, res) => {
  try {
    const { type, content } = req.body;
    
    // Validate input
    if (!type || !content) {
      return res.status(400).json({ message: 'Type and content are required' });
    }
    
    // Create document
    const document = await createDocument({ type, content });
    
    res.status(201).json({
      message: 'Document created successfully',
      document: document
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDocument = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate input
    if (!type) {
      return res.status(400).json({ message: 'Document type is required' });
    }
    
    // Get document
    const document = await getDocumentByType(type);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.status(200).json({
      message: 'Document fetched successfully',
      document: document
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllDocumentsHandler = async (req, res) => {
  try {
    // Get all documents
    const documents = await getAllDocuments();
    
    res.status(200).json({
      message: 'Documents fetched successfully',
      documents: documents
    });
  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateDocumentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, content } = req.body;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'Document ID is required' });
    }
    
    if (!type || !content) {
      return res.status(400).json({ message: 'Type and content are required' });
    }
    
    // Update document
    const document = await updateDocument(id, { type, content });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.status(200).json({
      message: 'Document updated successfully',
      document: document
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteDocumentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'Document ID is required' });
    }
    
    // Delete document
    const result = await deleteDocument(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.status(200).json({
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createDocumentHandler,
  getDocument,
  getAllDocumentsHandler,
  updateDocumentHandler,
  deleteDocumentHandler
};
