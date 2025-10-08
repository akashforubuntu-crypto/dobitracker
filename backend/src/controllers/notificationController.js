const { 
  createMultipleNotifications, 
  getNotificationsByDeviceIdAndApp,
  getAllNotificationsByDeviceId
} = require('../models/notificationModel');
const { updatePermissionStatus } = require('../models/userModel');

const uploadNotifications = async (req, res) => {
  try {
    const { device_id, notifications, permission_status } = req.body;
    
    // Validate input
    if (!device_id) {
      return res.status(400).json({ message: 'Device ID is required' });
    }
    
    if (!Array.isArray(notifications)) {
      return res.status(400).json({ message: 'Notifications must be an array' });
    }
    
    // Update permission status
    if (typeof permission_status === 'boolean') {
      await updatePermissionStatus(device_id, permission_status);
    }
    
    // Process notifications
    if (notifications.length > 0) {
      // Add device_id to each notification
      const notificationsWithDeviceId = notifications.map(notification => ({
        ...notification,
        deviceId: device_id
      }));
      
      // Create notifications in database
      await createMultipleNotifications(notificationsWithDeviceId);
    }
    
    res.status(200).json({
      message: 'Notifications uploaded successfully',
      count: notifications.length
    });
  } catch (error) {
    console.error('Upload notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const fetchNotifications = async (req, res) => {
  try {
    const { device_id, app } = req.query;
    
    // Validate input
    if (!device_id) {
      return res.status(400).json({ message: 'Device ID is required' });
    }
    
    let notifications;
    
    if (app) {
      // Fetch notifications for specific app
      notifications = await getNotificationsByDeviceIdAndApp(device_id, app);
    } else {
      // Fetch all notifications for device
      notifications = await getAllNotificationsByDeviceId(device_id);
    }
    
    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications: notifications
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  uploadNotifications,
  fetchNotifications
};
