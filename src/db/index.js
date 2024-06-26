const { Pool } = require("pg");
const fs = require("fs");

let ssl = {};
if (process.env.NODE_ENV === "production") {
  ssl = {
    rejectUnauthorized: false,
  };
} else {
  ssl = {
    ca: fs.readFileSync("//usr/local/var/postgresql@14/server.crt").toString(),
  };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ssl,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
