const {
  getAllPlayers,
  createPlayerDB,
  getCareerHighsDB,
} = require("../db/players");

async function getPlayers(req, res) {
  try {
    const players = await getAllPlayers();
    res.send({ results: players });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
}

async function createPlayer(req, res) {
  try {
    const { player_name } = req.body;
    if (!player_name) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const players = await createPlayerDB(player_name);
    res.send({ results: players });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
}

async function getCareerHighs(req, res) {
  try {
    const results = await getCareerHighsDB();
    res.send({ results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
}

module.exports = {
  getPlayers,
  createPlayer,
  getCareerHighs,
};
