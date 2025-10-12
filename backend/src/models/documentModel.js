const db = require('../../database/db');

const createDocumentsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      version INT DEFAULT 1,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await db.query(query);
    console.log('Documents table created successfully');
  } catch (err) {
    console.error('Error creating documents table:', err);
  }
};

const createDocument = async (documentData) => {
  const { type, title, html_content } = documentData;
  
  const query = `
    INSERT INTO documents (type, title, html_content)
    VALUES ($1, $2, $3)
    RETURNING id, type, title, html_content, created_at, updated_at
  `;
  
  const values = [type, title, html_content];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getDocumentByType = async (type) => {
  const query = `
    SELECT * FROM documents 
    WHERE type = $1
    ORDER BY updated_at DESC
    LIMIT 1
  `;
  
  const values = [type];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getDocumentById = async (id) => {
  const query = `
    SELECT * FROM documents 
    WHERE id = $1
  `;
  
  const values = [id];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getAllDocuments = async () => {
  const query = 'SELECT * FROM documents ORDER BY type, updated_at DESC';
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const updateDocument = async (id, documentData) => {
  const { title, html_content } = documentData;
  
  const query = `
    UPDATE documents 
    SET title = $1, html_content = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING id, type, title, html_content, created_at, updated_at
  `;
  
  const values = [title, html_content, id];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const deleteDocument = async (id) => {
  const query = 'DELETE FROM documents WHERE id = $1 RETURNING id';
  const values = [id];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createDocumentsTable,
  createDocument,
  getDocumentByType,
  getDocumentById,
  getAllDocuments,
  updateDocument,
  deleteDocument
};
