const cool = require("cool-ascii-faces");
const {
  getAllGames,
  createGameDB,
  getGetMetaDataDB,
  getGameLogDB,
  getGameDB,
} = require("../db/game");

async function getEmoji(req, res) {
  res.json({ message: cool() });
}

async function getGames(req, res) {
  const results = await getAllGames();
  res.send({ results });
}

async function createGame(req, res) {
  try {
    if (!req.body.date || !req.body.gameName) {
      return res.status(400).send({ error: "Missing required fields" });
    }
    const results = await createGameDB(req.body.gameName, req.body.date);
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

async function getGame(req, res) {
  try {
    const results = await getGameDB(req.params.gameId);
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

async function getGameMetaData(req, res) {
  try {
    const results = await getGetMetaDataDB(req.params.gameId);
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

async function getGameLog(req, res) {
  try {
    const results = await getGameLogDB(req.params.gameId);
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

module.exports = {
  getEmoji,
  getGames,
  getGame,
  createGame,
  getGameMetaData,
  getGameLog,
};
