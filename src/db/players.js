const db = require("./index.js");

async function getAllPlayers() {
  const { rows } = await db.query("SELECT * FROM player");
  return rows;
}

module.exports = {
  getAllPlayers,
};
