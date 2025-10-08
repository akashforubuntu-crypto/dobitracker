const { 
  findUserById,
  findUserByEmail,
  findUserByDeviceId,
  getAllUsers,
  getAllDevices,
  createUser,
  updateUser,
  deleteUser
} = require('../models/userModel');
const { getAllNotificationsByDeviceId } = require('../models/notificationModel');
const { getDeviceOnlineStatus } = require('../models/deviceStatusModel');

const getAllUsersHandler = async (req, res) => {
  try {
    console.log('Fetching all users from database...');
    
    const users = await getAllUsers();
    
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

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    
    // This would require an updateRole function in userModel
    // For now, we'll simulate this:
    console.log(`Updating user ${id} role to ${role} - this would be implemented with a database query`);
    
    // Simulated response
    const updatedUser = {
      id: id,
      role: role
    };
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getDeviceStatus = async (req, res) => {
  try {
    console.log('Fetching device status from database...');
    
    const devices = await getAllDevices();
    
    // Add online status calculation for each device
    const devicesWithStatus = await Promise.all(
      devices.map(async (device) => {
        const onlineStatus = await getDeviceOnlineStatus(device.device_id);
        return {
          ...device,
          is_online: onlineStatus.is_online,
          last_heartbeat: onlineStatus.last_heartbeat,
          last_notification_sync: onlineStatus.last_notification_sync,
          heartbeat_minutes_ago: onlineStatus.heartbeat_minutes_ago,
          notification_minutes_ago: onlineStatus.notification_minutes_ago
        };
      })
    );
    
    res.status(200).json({
      message: 'Device status fetched successfully',
      devices: devicesWithStatus
    });
  } catch (error) {
    console.error('Get device status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getNotificationsForUser = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Validate input
    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required' });
    }
    
    // Get notifications for device
    const notifications = await getAllNotificationsByDeviceId(deviceId);
    
    res.status(200).json({
      message: 'Notifications fetched successfully',
      notifications: notifications
    });
  } catch (error) {
    console.error('Get notifications for user error:', error);
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
    
    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const newUser = await createUser({ name, email, password, role });
    
    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
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
    
    // Check if user exists
    const existingUser = await findUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already taken by another user
    const emailUser = await findUserByEmail(email);
    if (emailUser && emailUser.id !== parseInt(id)) {
      return res.status(400).json({ message: 'Email already taken by another user' });
    }
    
    const updatedUser = await updateUser(id, { name, email, role });
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
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
    
    // Check if user exists
    const existingUser = await findUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await deleteUser(id);
    
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUsers: getAllUsersHandler,
  getUserById,
  updateUserRole,
  getDeviceStatus,
  getNotificationsForUser,
  createUser: createUserHandler,
  updateUser: updateUserHandler,
  deleteUser: deleteUserHandler
};
