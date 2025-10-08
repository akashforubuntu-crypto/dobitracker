const db = require('../../database/db');

const createDeviceStatusTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS device_status (
      id SERIAL PRIMARY KEY,
      device_id UUID NOT NULL UNIQUE,
      is_online BOOLEAN DEFAULT FALSE,
      last_heartbeat TIMESTAMP,
      last_notification_sync TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await db.query(query);
    console.log('Device status table created successfully');
  } catch (err) {
    console.error('Error creating device status table:', err);
  }
};

const updateDeviceHeartbeat = async (deviceId) => {
  const query = `
    INSERT INTO device_status (device_id, is_online, last_heartbeat, last_notification_sync)
    VALUES ($1, true, NOW(), NOW())
    ON CONFLICT (device_id) 
    DO UPDATE SET 
      is_online = true,
      last_heartbeat = NOW(),
      last_notification_sync = NOW(),
      updated_at = NOW()
  `;
  
  const values = [deviceId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getDeviceOnlineStatus = async (deviceId) => {
  const query = `
    SELECT 
      device_id,
      is_online,
      last_heartbeat,
      last_notification_sync,
      CASE 
        WHEN last_heartbeat IS NULL THEN NULL
        WHEN last_heartbeat > NOW() - INTERVAL '2 minutes' THEN true
        ELSE false
      END as is_recently_active
    FROM device_status 
    WHERE device_id = $1
  `;
  
  const values = [deviceId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getAllDeviceStatuses = async () => {
  const query = `
    SELECT 
      ds.device_id,
      ds.is_online,
      ds.last_heartbeat,
      ds.last_notification_sync,
      u.name as user_name,
      u.email as user_email,
      CASE 
        WHEN ds.last_heartbeat IS NULL THEN NULL
        WHEN ds.last_heartbeat > NOW() - INTERVAL '2 minutes' THEN true
        ELSE false
      END as is_recently_active,
      EXTRACT(EPOCH FROM (NOW() - ds.last_heartbeat))/60 as heartbeat_minutes_ago,
      EXTRACT(EPOCH FROM (NOW() - ds.last_notification_sync))/60 as notification_minutes_ago
    FROM device_status ds
    LEFT JOIN users u ON ds.device_id = u.device_id
    ORDER BY ds.updated_at DESC
  `;
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const markDeviceOffline = async (deviceId) => {
  const query = `
    UPDATE device_status 
    SET is_online = false, updated_at = NOW()
    WHERE device_id = $1
  `;
  
  const values = [deviceId];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createDeviceStatusTable,
  updateDeviceHeartbeat,
  getDeviceOnlineStatus,
  getAllDeviceStatuses,
  markDeviceOffline
};
