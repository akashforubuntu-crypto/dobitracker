const { createUserTable } = require('../src/models/userModel');
const { createNotificationsTable } = require('../src/models/notificationModel');
const { createDocumentsTable } = require('../src/models/documentModel');
const { createBlogsTable } = require('../src/models/blogModel');
const { createPasswordResetsTable } = require('../src/models/passwordResetModel');

const initTables = async () => {
  try {
    console.log('Initializing database tables...');
    
    // Create all tables
    await createUserTable();
    await createNotificationsTable();
    await createDocumentsTable();
    await createBlogsTable();
    await createPasswordResetsTable();
    
    console.log('All database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};

// Run the initialization if this file is executed directly
if (require.main === module) {
  initTables();
}

module.exports = initTables;
