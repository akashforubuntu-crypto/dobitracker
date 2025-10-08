const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Parse the connection string
const url = new URL(process.env.AIVEN_DB_URL);
const params = url.searchParams;

// Add sslmode to the connection parameters if not already present
if (!params.has('sslmode')) {
  params.set('sslmode', 'require');
}

// Create a new pool instance with SSL options
const pool = new Pool({
  connectionString: url.toString(),
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
    console.log(res.rows);
  }
  pool.end();
});
