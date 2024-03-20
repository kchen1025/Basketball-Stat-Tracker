const db = require("./index.js");

async function getAllPlayers() {
  const { rows } = await db.query("SELECT * FROM player");
  return rows;
}

async function createPlayerDB(player_name) {
  const { rows } = await db.query(
    "insert into player(name) values ($1) returning *",
    [player_name]
  );
  return rows;
}

module.exports = {
  getAllPlayers,
  createPlayerDB,
};
