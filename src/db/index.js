const { Pool } = require("pg");
const fs = require("fs");

let ssl = {};
if (process.env.NODE_ENV === "production") {
  console.log("USING PRODUCTION CERTS");
  const cert = Buffer.from(process.env.CERTIFICATE_BASE64, "base64").toString();
  console.log("CERT", cert);
  // ssl = {
  //   rejectUnauthorized: true,
  //   ca: cert, // Use the decoded certificate here
  // };
  ssl: {
    rejectUnauthorized: false;
  }
} else {
  console.log("USING DEVELOPMENT CERTS");
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
