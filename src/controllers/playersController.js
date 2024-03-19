const playersDb = require("../db/players");

async function getPlayers(req, res) {
  try {
    const players = await playersDb.getAllPlayers();
    res.send({ results: players });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
}

module.exports = {
  getPlayers,
};
