const { 
  findUserById,
  findUserByEmail,
  findUserByDeviceId,
  getAllUsers: getAllUsersFromModel,
  updateUser,
  deleteUser,
  createUser
} = require('../models/userModel');
const { 
  getAllNotificationsByDeviceId,
  getAllNotificationsByDeviceIdPaginated,
  getNotificationCountByDeviceId,
  getNotificationsByDeviceIdAndAppPaginated,
  getNotificationCountByDeviceIdAndApp,
  getNotificationsByDeviceIdForOtherAppsPaginated,
  getNotificationCountByDeviceIdForOtherApps,
  getNotificationCountOlderThanDate,
  deleteNotificationsOlderThanDate
} = require('../models/notificationModel');

const getAllUsersHandler = async (req, res) => {
  try {
    console.log('Fetching all users from database...');
    const users = await getAllUsersFromModel();
    res.status(200).json({
      message: 'Users fetched successfully',
      users: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Find user
    const user = await findUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User fetched successfully',
      user: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required' });
    }
    
    console.log(`Updating user ${id} with data:`, { name, email, role });
    
    const updatedUser = await updateUser(id, { name, email, role });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getNotificationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { app, page = 1, limit = 25 } = req.query;
    
    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log(`Fetching notifications for user ID: ${userId}, app: ${app}, page: ${page}, limit: ${limit}`);
    
    // First, find the user by ID to get their device ID
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const deviceId = user.device_id;
    console.log(`Found user: ${user.name} (${user.email}), device ID: ${deviceId}`);
    
    // Validate that device_id exists
    if (!deviceId) {
      return res.status(400).json({ message: 'User does not have a device ID' });
    }
    
    let notifications;
    let totalCount;
    
            if (app === 'other') {
              // Get notifications for "other" apps (NOT WhatsApp or Instagram) with pagination
              const offset = (page - 1) * limit;
              notifications = await getNotificationsByDeviceIdForOtherAppsPaginated(deviceId, limit, offset);
              totalCount = await getNotificationCountByDeviceIdForOtherApps(deviceId);
            } else if (app) {
              // Get notifications for specific app with pagination
              const offset = (page - 1) * limit;
              notifications = await getNotificationsByDeviceIdAndAppPaginated(deviceId, app, limit, offset);
              totalCount = await getNotificationCountByDeviceIdAndApp(deviceId, app);
            } else {
              // Get all notifications for device with pagination
              const offset = (page - 1) * limit;
              notifications = await getAllNotificationsByDeviceIdPaginated(deviceId, limit, offset);
              totalCount = await getNotificationCountByDeviceId(deviceId);
            }
    
    const totalPages = Math.ceil(totalCount / limit);
    
    res.status(200).json({
      message: 'Notifications fetched successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        device_id: user.device_id
      },
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
    console.error('Get notifications for user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log(`Deleting user ${id} from database...`);
    
    const deletedUser = await deleteUser(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUserHandler = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    console.log(`Creating new user:`, { name, email, role });
    
    const newUser = await createUser({ name, email, password, role });
    
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Preview cleanup - get count of notifications to be deleted
const previewCleanup = async (req, res) => {
  try {
    const { cutoffDate } = req.body;
    
    // Validate input
    if (!cutoffDate) {
      return res.status(400).json({ message: 'Cutoff date is required' });
    }
    
    // Validate date format
    const date = new Date(cutoffDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Prevent future dates
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (date > today) {
      return res.status(400).json({ message: 'Cannot select future dates' });
    }
    
    console.log(`Previewing cleanup for date: ${cutoffDate}`);
    
    const count = await getNotificationCountOlderThanDate(cutoffDate);
    
    res.status(200).json({
      message: 'Cleanup preview generated successfully',
      cutoffDate: cutoffDate,
      notificationsToDelete: count
    });
  } catch (error) {
    console.error('Preview cleanup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Execute cleanup - delete notifications older than specified date
const executeCleanup = async (req, res) => {
  try {
    const { cutoffDate } = req.body;
    
    // Validate input
    if (!cutoffDate) {
      return res.status(400).json({ message: 'Cutoff date is required' });
    }
    
    // Validate date format
    const date = new Date(cutoffDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Prevent future dates
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (date > today) {
      return res.status(400).json({ message: 'Cannot select future dates' });
    }
    
    console.log(`Executing cleanup for date: ${cutoffDate}`);
    
    const deletedCount = await deleteNotificationsOlderThanDate(cutoffDate);
    
    console.log(`Cleanup completed: ${deletedCount} notifications deleted`);
    
    res.status(200).json({
      message: 'Cleanup executed successfully',
      cutoffDate: cutoffDate,
      notificationsDeleted: deletedCount
    });
  } catch (error) {
    console.error('Execute cleanup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUsersHandler,
  getUserById,
  updateUserHandler,
  getNotificationsForUser,
  deleteUserHandler,
  createUserHandler,
  previewCleanup,
  executeCleanup
};
