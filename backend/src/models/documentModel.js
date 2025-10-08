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
  const { type, content, version = 1 } = documentData;
  
  const query = `
    INSERT INTO documents (type, content, version)
    VALUES ($1, $2, $3)
    RETURNING id, type, content, version, updated_at
  `;
  
  const values = [type, content, version];
  
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
    ORDER BY version DESC
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

const getAllDocuments = async () => {
  const query = 'SELECT * FROM documents ORDER BY type, version DESC';
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const updateDocument = async (id, documentData) => {
  const { type, content } = documentData;
  
  const query = `
    UPDATE documents 
    SET content = $1, version = version + 1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, type, content, version, updated_at
  `;
  
  const values = [content, id];
  
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
  getAllDocuments,
  updateDocument,
  deleteDocument
};
