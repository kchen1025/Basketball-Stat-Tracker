const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5001;

const routes = require("./src/routes");

const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// app
//   .use(express.static(path.join(__dirname, "public")))
//   .set("views", path.join(__dirname, "views"))
//   .set("view engine", "ejs");

app.set("view engine", "ejs");

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "client/dist")));

app.use("/api", routes);

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client/dist", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
