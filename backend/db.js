const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  family: 4 // This forces Node.js to use IPv4 only, bypassing the blocked IPv6 address
});

module.exports = pool;