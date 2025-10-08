#!/usr/bin/env node

// Simple script to reset the database
const resetDatabase = require('./scripts/resetDatabase');

console.log('🚀 DobiTracker Database Reset Tool');
console.log('=====================================');

resetDatabase()
  .then(() => {
    console.log('\n✅ Database reset completed successfully!');
    console.log('🎯 You can now start the server with: npm start');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Database reset failed:', error.message);
    process.exit(1);
  });
