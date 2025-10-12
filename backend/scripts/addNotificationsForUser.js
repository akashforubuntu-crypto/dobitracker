const { Pool } = require('pg');
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

async function addNotificationsForUser() {
  try {
    console.log('Adding notifications for user: akashforubuntu@gmail.com');
    console.log('Device ID: e6bff045-c459-4d62-86b6-c5c00f23774e');
    
    // Add test notifications for the user
    const notificationQuery = `
      INSERT INTO notifications (device_id, app_name, sender, message, timestamp)
      VALUES 
        ($1, 'WhatsApp', 'John Doe', 'Hey! How are you doing?', NOW() - INTERVAL '1 hour'),
        ($1, 'WhatsApp', 'Sarah Wilson', 'Can we meet for coffee tomorrow?', NOW() - INTERVAL '2 hours'),
        ($1, 'WhatsApp', 'Mike Johnson', 'Thanks for the help with the project!', NOW() - INTERVAL '3 hours'),
        ($1, 'Instagram', 'Photo Bot', 'You have 5 new followers', NOW() - INTERVAL '4 hours'),
        ($1, 'Instagram', 'Story Bot', 'Your story was viewed 25 times', NOW() - INTERVAL '5 hours'),
        ($1, 'Instagram', 'Explore Bot', 'New posts from people you follow', NOW() - INTERVAL '6 hours'),
        ($1, 'Telegram', 'News Channel', 'Breaking: Tech news update', NOW() - INTERVAL '7 hours'),
        ($1, 'Telegram', 'Work Group', 'Meeting reminder for 3 PM', NOW() - INTERVAL '8 hours'),
        ($1, 'Gmail', 'Amazon', 'Your order has been shipped', NOW() - INTERVAL '9 hours'),
        ($1, 'Gmail', 'Bank Alert', 'Transaction completed: $50.00', NOW() - INTERVAL '10 hours'),
        ($1, 'Gmail', 'Newsletter', 'Weekly tech digest', NOW() - INTERVAL '11 hours'),
        ($1, 'Facebook', 'Friend Request', 'New friend request from Alex', NOW() - INTERVAL '12 hours'),
        ($1, 'Facebook', 'Page Update', 'Your page got 10 new likes', NOW() - INTERVAL '13 hours'),
        ($1, 'Twitter', 'Tweet Alert', 'Your tweet got 5 retweets', NOW() - INTERVAL '14 hours'),
        ($1, 'Twitter', 'Mention', 'You were mentioned in a tweet', NOW() - INTERVAL '15 hours'),
        ($1, 'LinkedIn', 'Job Alert', 'New job matches your profile', NOW() - INTERVAL '16 hours'),
        ($1, 'LinkedIn', 'Connection', 'New connection request', NOW() - INTERVAL '17 hours'),
        ($1, 'YouTube', 'Subscription', 'New video from subscribed channel', NOW() - INTERVAL '18 hours'),
        ($1, 'YouTube', 'Comment', 'Someone commented on your video', NOW() - INTERVAL '19 hours'),
        ($1, 'Discord', 'Server Update', 'New message in #general', NOW() - INTERVAL '20 hours')
      ON CONFLICT DO NOTHING
    `;
    
    await pool.query(notificationQuery, ['e6bff045-c459-4d62-86b6-c5c00f23774e']);
    console.log('✅ 20 test notifications added successfully!');
    
    // Show summary of notifications by app
    const summaryQuery = `
      SELECT app_name, COUNT(*) as count 
      FROM notifications 
      WHERE device_id = $1 
      GROUP BY app_name 
      ORDER BY count DESC
    `;
    
    const summary = await pool.query(summaryQuery, ['e6bff045-c459-4d62-86b6-c5c00f23774e']);
    console.log('\n📊 Notification Summary:');
    summary.rows.forEach(row => {
      console.log(`  ${row.app_name}: ${row.count} notifications`);
    });
    
  } catch (error) {
    console.error('❌ Error adding notifications:', error);
  } finally {
    await pool.end();
  }
}

addNotificationsForUser();
