const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Disable SSL certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.AIVEN_DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
