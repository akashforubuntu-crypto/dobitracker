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
        notification.appName,
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

module.exports = {
  createNotificationsTable,
  createNotification,
  createMultipleNotifications,
  getNotificationsByDeviceIdAndApp,
  getAllNotificationsByDeviceId
};
