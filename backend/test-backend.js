const dotenv = require('dotenv');
dotenv.config();

const { createUserTable, findUserByEmail } = require('./src/models/userModel');
const { createNotificationsTable } = require('./src/models/notificationModel');
const { createDocumentsTable } = require('./src/models/documentModel');
const { createBlogsTable } = require('./src/models/blogModel');
const { createPasswordResetsTable } = require('./src/models/passwordResetModel');

async function testBackend() {
    console.log('Testing DobiTracker Backend');
    
    try {
        // Test database connection by creating tables
        console.log('Creating database tables...');
        await createUserTable();
        await createNotificationsTable();
        await createDocumentsTable();
        await createBlogsTable();
        await createPasswordResetsTable();
        console.log('Database tables created successfully');
        
        // Test finding a user (this will return null if no users exist)
        console.log('Testing user lookup...');
        const user = await findUserByEmail('test@example.com');
        console.log('User lookup result:', user);
        
        console.log('Backend test completed successfully');
    } catch (error) {
        console.error('Backend test failed:', error);
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testBackend();
}

module.exports = testBackend;
