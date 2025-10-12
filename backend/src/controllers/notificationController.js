const { 
  createMultipleNotifications, 
  getNotificationsByDeviceIdAndApp,
  getAllNotificationsByDeviceId,
  getAllNotificationsByDeviceIdPaginated,
  getNotificationCountByDeviceId,
  getNotificationsByDeviceIdAndAppPaginated,
  getNotificationCountByDeviceIdAndApp,
  getNotificationsByDeviceIdForOtherAppsPaginated,
  getNotificationCountByDeviceIdForOtherApps
} = require('../models/notificationModel');
const { updatePermissionStatus, updateLastSyncTime } = require('../models/userModel');

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
    
    // Update last sync timestamp for the device
    await updateLastSyncTime(device_id);
    
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
    const { device_id, app, page = 1, limit = 25 } = req.query;
    
    // Validate input
    if (!device_id) {
      return res.status(400).json({ message: 'Device ID is required' });
    }
    
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // For regular users, check if they can only access their own device
    // Admins can access any device (checked in admin routes)
    if (req.user.role !== 'admin') {
      if (!req.user.device_id || req.user.device_id !== device_id) {
        return res.status(403).json({ message: 'Access denied: You can only view your own notifications' });
      }
    }
    
    console.log(`Fetching notifications for device: ${device_id}, app: ${app}, page: ${page}, limit: ${limit}`);
    
    let notifications;
    let totalCount;
    
    if (app === 'other') {
      // Get notifications for "other" apps (NOT WhatsApp or Instagram) with pagination
      const offset = (page - 1) * limit;
      notifications = await getNotificationsByDeviceIdForOtherAppsPaginated(device_id, limit, offset);
      totalCount = await getNotificationCountByDeviceIdForOtherApps(device_id);
    } else if (app) {
      // Get notifications for specific app with pagination
      const offset = (page - 1) * limit;
      notifications = await getNotificationsByDeviceIdAndAppPaginated(device_id, app, limit, offset);
      totalCount = await getNotificationCountByDeviceIdAndApp(device_id, app);
    } else {
      // Get all notifications for device with pagination
      const offset = (page - 1) * limit;
      notifications = await getAllNotificationsByDeviceIdPaginated(device_id, limit, offset);
      totalCount = await getNotificationCountByDeviceId(device_id);
    }
    
    const totalPages = Math.ceil(totalCount / limit);
    
    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications: notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalCount: totalCount,
        limit: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
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
