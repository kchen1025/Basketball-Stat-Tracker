const express = require("express");
const path = require("path");
const cool = require("cool-ascii-faces");

const PORT = process.env.PORT || 5001;

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// app
//   .use(express.static(path.join(__dirname, "public")))
//   .set("views", path.join(__dirname, "views"))
//   .set("view engine", "ejs");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "client/dist")));

app.get("/", (req, res) => res.render("pages/index"));

app.get("/api", (req, res) => {
  res.json({ message: "Hello " });
});

app.get("/api/cool", (req, res) => {
  res.json({ message: cool() });
});

app.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM test_table");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/dist", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
