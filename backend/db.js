const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://ywmoxunrsjyscastewvl:Mutende@2015@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  family: 4
});

module.exports = pool;