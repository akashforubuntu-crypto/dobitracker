const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

// Disable SSL certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Database configuration - use same as main app
const pool = new Pool({
  connectionString: process.env.AIVEN_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('Test123456!', 10);
    
    // Check if user with this device ID already exists
    const checkQuery = `SELECT * FROM users WHERE device_id = $1`;
    const existingUser = await pool.query(checkQuery, ['7cf12c42-ead1-46c4-9e51-2313dbd0cf46']);
    
    if (existingUser.rows.length > 0) {
      console.log('User with device ID already exists:', existingUser.rows[0]);
    } else {
      // Create user with specific device ID
      const query = `
        INSERT INTO users (name, email, password_hash, role, device_id, android_id, permission_status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          device_id = EXCLUDED.device_id
        RETURNING *
      `;
      
      const values = [
        'Test User',
        'testuser@example.com',
        hashedPassword,
        'user',
        '7cf12c42-ead1-46c4-9e51-2313dbd0cf46', // Specific device ID
        uuidv4(),
        true,
        new Date()
      ];
      
      const result = await pool.query(query, values);
      console.log('Test user created/updated:', result.rows[0]);
    }
    
    // Also create some test notifications
    console.log('Creating test notifications...');
    
    const notificationQuery = `
      INSERT INTO notifications (device_id, app_name, sender, message, timestamp)
      VALUES 
        ($1, 'WhatsApp', 'John Doe', 'Hello, how are you?', NOW() - INTERVAL '1 hour'),
        ($1, 'WhatsApp', 'Jane Smith', 'Can we meet tomorrow?', NOW() - INTERVAL '2 hours'),
        ($1, 'Instagram', 'Photo Bot', 'You have 3 new followers', NOW() - INTERVAL '3 hours'),
        ($1, 'Instagram', 'Story Bot', 'Your story was viewed 15 times', NOW() - INTERVAL '4 hours'),
        ($1, 'Telegram', 'Bob Wilson', 'Meeting at 3 PM', NOW() - INTERVAL '5 hours'),
        ($1, 'Telegram', 'Alice Brown', 'Document shared', NOW() - INTERVAL '6 hours'),
        ($1, 'Gmail', 'Newsletter', 'Weekly tech news', NOW() - INTERVAL '7 hours'),
        ($1, 'Gmail', 'Bank Alert', 'Transaction completed', NOW() - INTERVAL '8 hours')
      ON CONFLICT DO NOTHING
    `;
    
    await pool.query(notificationQuery, ['7cf12c42-ead1-46c4-9e51-2313dbd0cf46']);
    console.log('Test notifications created');
    
    console.log('✅ Test user and notifications created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();
