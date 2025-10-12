const db = require('../../database/db');

const createNotificationsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      device_id UUID NOT NULL,
      app_name VARCHAR(255) NOT NULL,
      sender TEXT,
      message TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await db.query(query);
    console.log('Notifications table created successfully');
  } catch (err) {
    console.error('Error creating notifications table:', err);
  }
};

const createNotification = async (notificationData) => {
  const { deviceId, appName, sender, message, timestamp } = notificationData;
  
  const query = `
    INSERT INTO notifications (device_id, app_name, sender, message, timestamp)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, device_id, app_name, sender, message, timestamp
  `;
  
  const values = [deviceId, appName, sender, message, timestamp || new Date()];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const createMultipleNotifications = async (notifications) => {
  const query = `
    INSERT INTO notifications (device_id, app_name, sender, message, timestamp)
    VALUES ($1, $2, $3, $4, $5)
  `;
  
  try {
    const results = [];
    for (const notification of notifications) {
      const values = [
        notification.deviceId,
        notification.app_name || notification.appName, // Handle both API field names
        notification.sender,
        notification.message,
        notification.timestamp || new Date()
      ];
      const result = await db.query(query, values);
      results.push(result);
    }
    return results;
  } catch (err) {
    throw err;
  }
};

const getNotificationsByDeviceIdAndApp = async (deviceId, appName) => {
  const query = `
    SELECT * FROM notifications 
    WHERE device_id = $1 AND app_name = $2
    ORDER BY timestamp DESC
  `;
  
  const values = [deviceId, appName];
  
  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getAllNotificationsByDeviceId = async (deviceId) => {
  const query = `
    SELECT * FROM notifications 
    WHERE device_id = $1
    ORDER BY timestamp DESC
  `;
  
  const values = [deviceId];
  
  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Paginated version of getAllNotificationsByDeviceId
const getAllNotificationsByDeviceIdPaginated = async (deviceId, limit, offset) => {
  const query = `
    SELECT * FROM notifications 
    WHERE device_id = $1
    ORDER BY timestamp DESC
    LIMIT $2 OFFSET $3
  `;
  
  const values = [deviceId, limit, offset];
  
  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Get count of notifications for a device
const getNotificationCountByDeviceId = async (deviceId) => {
  const query = `
    SELECT COUNT(*) as count
    FROM notifications 
    WHERE device_id = $1
  `;
  
  const values = [deviceId];
  
  try {
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (err) {
    throw err;
  }
};

// Paginated version of getNotificationsByDeviceIdAndApp
const getNotificationsByDeviceIdAndAppPaginated = async (deviceId, appName, limit, offset) => {
  const query = `
    SELECT * FROM notifications 
    WHERE device_id = $1 AND app_name = $2
    ORDER BY timestamp DESC
    LIMIT $3 OFFSET $4
  `;
  
  const values = [deviceId, appName, limit, offset];
  
  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Get count of notifications for a device and app
const getNotificationCountByDeviceIdAndApp = async (deviceId, appName) => {
  const query = `
    SELECT COUNT(*) as count
    FROM notifications 
    WHERE device_id = $1 AND app_name = $2
  `;
  
  const values = [deviceId, appName];
  
  try {
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (err) {
    throw err;
  }
};

// Get notifications for "other" apps (NOT WhatsApp or Instagram) with pagination
const getNotificationsByDeviceIdForOtherAppsPaginated = async (deviceId, limit, offset) => {
  const query = `
    SELECT * FROM notifications 
    WHERE device_id = $1 AND app_name NOT IN ('WhatsApp', 'Instagram')
    ORDER BY timestamp DESC
    LIMIT $2 OFFSET $3
  `;
  
  const values = [deviceId, limit, offset];
  
  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Get count of notifications for "other" apps (NOT WhatsApp or Instagram)
const getNotificationCountByDeviceIdForOtherApps = async (deviceId) => {
  const query = `
    SELECT COUNT(*) as count
    FROM notifications 
    WHERE device_id = $1 AND app_name NOT IN ('WhatsApp', 'Instagram')
  `;
  
  const values = [deviceId];
  
  try {
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (err) {
    throw err;
  }
};

// Get count of notifications older than a specific date (for cleanup preview)
const getNotificationCountOlderThanDate = async (cutoffDate) => {
  const query = `
    SELECT COUNT(*) as count
    FROM notifications 
    WHERE timestamp < $1
  `;
  
  const values = [cutoffDate];
  
  try {
    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  } catch (err) {
    throw err;
  }
};

// Delete notifications older than a specific date (for cleanup execution)
const deleteNotificationsOlderThanDate = async (cutoffDate) => {
  // First, get the count of notifications to be deleted
  const countQuery = `
    SELECT COUNT(*) as count
    FROM notifications 
    WHERE timestamp < $1
  `;
  
  // Then delete the notifications
  const deleteQuery = `
    DELETE FROM notifications 
    WHERE timestamp < $1
  `;
  
  const values = [cutoffDate];
  
  try {
    // Get the count first
    const countResult = await db.query(countQuery, values);
    const countToDelete = parseInt(countResult.rows[0].count);
    
    // Perform the deletion
    await db.query(deleteQuery, values);
    
    return countToDelete;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createNotificationsTable,
  createNotification,
  createMultipleNotifications,
  getNotificationsByDeviceIdAndApp,
  getAllNotificationsByDeviceId,
  getAllNotificationsByDeviceIdPaginated,
  getNotificationCountByDeviceId,
  getNotificationsByDeviceIdAndAppPaginated,
  getNotificationCountByDeviceIdAndApp,
  getNotificationsByDeviceIdForOtherAppsPaginated,
  getNotificationCountByDeviceIdForOtherApps,
  getNotificationCountOlderThanDate,
  deleteNotificationsOlderThanDate
};
