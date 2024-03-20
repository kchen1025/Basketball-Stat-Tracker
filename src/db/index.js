const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: process.env.NODE_ENV !== "production" ? false : true,
  ssl: false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
