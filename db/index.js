const { Pool } = require("pg");

let pool;

try {
  pool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    port: process.env.PGPORT || "5432",
    max: process.env.PG_CLIENT_COUNT || 10,
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

module.exports = pool;
