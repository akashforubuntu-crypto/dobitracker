const db = require('../database/db');
const { hashPassword } = require('../src/utils/passwordUtils');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const resetDatabase = async () => {
  try {
    console.log('🔄 Starting database reset...');
    
    // Drop all tables in correct order (respecting foreign key constraints)
    console.log('🗑️  Dropping existing tables...');
    
    const dropQueries = [
      'DROP TABLE IF EXISTS device_status CASCADE',
      'DROP TABLE IF EXISTS notifications CASCADE',
      'DROP TABLE IF EXISTS documents CASCADE',
      'DROP TABLE IF EXISTS blogs CASCADE',
      'DROP TABLE IF EXISTS password_resets CASCADE',
      'DROP TABLE IF EXISTS users CASCADE'
    ];
    
    for (const query of dropQueries) {
      await db.query(query);
      console.log(`✅ Dropped table: ${query.split(' ')[4]}`);
    }
    
    // Recreate all tables
    console.log('🏗️  Creating fresh tables...');
    
    // Users table
    await db.query(`
      CREATE TABLE users (
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
    `);
    console.log('✅ Created users table');
    
    // Notifications table
    await db.query(`
      CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        device_id UUID NOT NULL,
        app_name VARCHAR(255) NOT NULL,
        sender TEXT,
        message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created notifications table');
    
    // Documents table
    await db.query(`
      CREATE TABLE documents (
        id SERIAL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        html_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created documents table');
    
    // Blogs table
    await db.query(`
      CREATE TABLE blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        featured_image_url TEXT,
        html_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created blogs table');
    
    // Password resets table
    await db.query(`
      CREATE TABLE password_resets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created password_resets table');
    
    // Device status table
    await db.query(`
      CREATE TABLE device_status (
        id SERIAL PRIMARY KEY,
        device_id UUID NOT NULL UNIQUE,
        is_online BOOLEAN DEFAULT FALSE,
        last_heartbeat TIMESTAMP,
        last_notification_sync TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created device_status table');
    
    // Create admin user from environment variables
    console.log('👤 Creating admin user...');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dobitracker.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    
    const hashedPassword = await hashPassword(adminPassword);
    const adminDeviceId = uuidv4();
    
    await db.query(`
      INSERT INTO users (name, email, password_hash, role, device_id, permission_status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [adminName, adminEmail, hashedPassword, 'admin', adminDeviceId, true]);
    
    console.log('✅ Admin user created successfully');
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
    console.log(`🆔 Admin Device ID: ${adminDeviceId}`);
    
    // Create some sample data
    console.log('📝 Creating sample data...');
    
    // Sample blog posts
    await db.query(`
      INSERT INTO blogs (title, featured_image_url, html_content)
      VALUES 
        ('Welcome to DobiTracker', 'https://via.placeholder.com/800x400', '<h2>Welcome to DobiTracker</h2><p>DobiTracker is a comprehensive Android notification capture system that allows you to track and manage your notifications across multiple devices.</p><p>Key features include:</p><ul><li>Real-time notification capture</li><li>Cross-device synchronization</li><li>Admin dashboard for monitoring</li><li>User-friendly interface</li></ul>'),
        ('Getting Started Guide', 'https://via.placeholder.com/800x400', '<h2>Getting Started with DobiTracker</h2><p>Follow these simple steps to get started with DobiTracker:</p><ol><li>Sign up for an account</li><li>Download the Android app</li><li>Enter your Device ID</li><li>Grant notification permissions</li><li>Start capturing notifications!</li></ol>')
    `);
    console.log('✅ Sample blog posts created');
    
    // Sample documents
    await db.query(`
      INSERT INTO documents (type, title, html_content)
      VALUES 
        ('privacy', 'Privacy Policy', '<h2>Privacy Policy</h2><p>Your privacy is important to us. This policy explains how we collect, use, and protect your information.</p>'),
        ('terms', 'Terms of Service', '<h2>Terms of Service</h2><p>By using DobiTracker, you agree to these terms and conditions.</p>')
    `);
    console.log('✅ Sample documents created');
    
    console.log('🎉 Database reset completed successfully!');
    console.log('🚀 You can now start the server and test the application.');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    // Database connection will be closed automatically
    console.log('🔌 Database connection will be closed automatically');
  }
};

// Run the reset if this file is executed directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('✅ Database reset completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database reset failed:', error);
      process.exit(1);
    });
}

module.exports = resetDatabase;
