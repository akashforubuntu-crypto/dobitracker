const db = require('../../database/db');
const bcrypt = require('bcryptjs');

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      device_id UUID UNIQUE,
      android_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      permission_status BOOLEAN DEFAULT TRUE
    )
  `;
  
  try {
    await db.query(query);
    console.log('Users table created successfully');
  } catch (err) {
    console.error('Error creating users table:', err);
  }
};

const createUser = async (userData) => {
  const { name, email, password, role = 'user', deviceId, androidId } = userData;
  
  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  const query = `
    INSERT INTO users (name, email, password_hash, role, device_id, android_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, role, device_id, android_id, created_at
  `;
  
  const values = [name, email, passwordHash, role, deviceId, androidId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [id];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const findUserByDeviceId = async (deviceId) => {
  const query = 'SELECT * FROM users WHERE device_id = $1';
  const values = [deviceId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updateDeviceId = async (userId, deviceId, androidId) => {
  const query = `
    UPDATE users 
    SET device_id = $1, android_id = $2 
    WHERE id = $3
    RETURNING id, device_id, android_id
  `;
  
  const values = [deviceId, androidId, userId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updatePermissionStatus = async (deviceId, status) => {
  const query = `
    UPDATE users 
    SET permission_status = $1 
    WHERE device_id = $2
    RETURNING id, permission_status
  `;
  
  const values = [status, deviceId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getAllUsers = async () => {
  const query = `
    SELECT 
      id, 
      name, 
      email, 
      role, 
      device_id, 
      android_id, 
      created_at, 
      permission_status
    FROM users 
    ORDER BY created_at DESC
  `;
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getAllDevices = async () => {
  const query = `
    SELECT 
      u.device_id,
      u.name as user_name,
      u.permission_status,
      u.created_at,
      ds.is_online,
      ds.last_heartbeat,
      ds.last_notification_sync
    FROM users u
    LEFT JOIN device_status ds ON u.device_id = ds.device_id
    WHERE u.device_id IS NOT NULL
    ORDER BY u.created_at DESC
  `;
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const updateUser = async (userId, userData) => {
  const { name, email, role } = userData;
  
  const query = `
    UPDATE users 
    SET name = $1, email = $2, role = $3
    WHERE id = $4
    RETURNING id, name, email, role, device_id, android_id, created_at, permission_status
  `;
  
  const values = [name, email, role, userId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (userId) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
  const values = [userId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUserTable,
  createUser,
  findUserByEmail,
  findUserById,
  findUserByDeviceId,
  updateDeviceId,
  updatePermissionStatus,
  getAllUsers,
  getAllDevices,
  updateUser,
  deleteUser
};
