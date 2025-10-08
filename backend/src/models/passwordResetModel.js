const db = require('../../database/db');

const createPasswordResetsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      reset_token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL
    )
  `;
  
  try {
    await db.query(query);
    console.log('Password resets table created successfully');
  } catch (err) {
    console.error('Error creating password resets table:', err);
  }
};

const createPasswordReset = async (resetData) => {
  const { email, resetToken, expiresAt } = resetData;
  
  const query = `
    INSERT INTO password_resets (email, reset_token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, email, reset_token, expires_at
  `;
  
  const values = [email, resetToken, expiresAt];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findValidResetByToken = async (token) => {
  const query = `
    SELECT * FROM password_resets 
    WHERE reset_token = $1 AND expires_at > NOW()
  `;
  
  const values = [token];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findValidResetByEmail = async (email) => {
  const query = `
    SELECT * FROM password_resets 
    WHERE email = $1 AND expires_at > NOW()
  `;
  
  const values = [email];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const deleteResetByToken = async (token) => {
  const query = 'DELETE FROM password_resets WHERE reset_token = $1 RETURNING id';
  const values = [token];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const deleteExpiredResets = async () => {
  const query = 'DELETE FROM password_resets WHERE expires_at < NOW()';
  
  try {
    const result = await db.query(query);
    return result.rowCount; // Returns number of deleted rows
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createPasswordResetsTable,
  createPasswordReset,
  findValidResetByToken,
  findValidResetByEmail,
  deleteResetByToken,
  deleteExpiredResets
};
