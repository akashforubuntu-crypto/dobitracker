const dotenv = require('dotenv');
dotenv.config();

const { findUserByEmail, createUser } = require('../src/models/userModel');

const initAdminUser = async () => {
  try {
    // Check if admin email and password are provided
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      console.log('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
      return;
    }
    
    // Check if admin user already exists
    const existingAdmin = await findUserByEmail(adminEmail);
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }
    
    // Create admin user
    const adminUserData = {
      name: 'Admin User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      deviceId: null,
      androidId: null
    };
    
    const adminUser = await createUser(adminUserData);
    
    console.log('Admin user created successfully:', {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Run the initialization if this file is executed directly
if (require.main === module) {
  initAdminUser();
}

module.exports = initAdminUser;
