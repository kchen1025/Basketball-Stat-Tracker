const {
  getAllPlayers,
  createPlayerDB,
  getCareerHighsDB,
  getPointsByPlayerDB,
} = require("../db/players");

const { getGameAndDay } = require("../utils");
const { pivotByDay } = require("../utils/pivotUtils");

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

const getKeysAndDataFromMap = (daysMap) => {
  const data = [];
  const gameKeys = new Set();

  daysMap.forEach((games, day, map) => {
    const curr = {};
    curr["day"] = day;
    for (const game of games) {
      const { day, game: gameName } = getGameAndDay(game.game_name);

      const gameKey = `G${gameName}`;
      curr[gameKey] = game.points;

      gameKeys.add(gameKey);
    }
    data.push({ ...curr });
  });

  const keys = Array.from(gameKeys).sort();

  return { keys, data };
};

async function getPointsByPlayer(req, res) {
  try {
    const pointHistory = await getPointsByPlayerDB(req.params.playerId);

    // calculate the number of days first
    const daysMap = pivotByDay(pointHistory);
    const { data, keys } = getKeysAndDataFromMap(daysMap);

    res.send({ data, keys });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
}

module.exports = {
  getPlayers,
  createPlayer,
  getCareerHighs,
  getPointsByPlayer,
};
