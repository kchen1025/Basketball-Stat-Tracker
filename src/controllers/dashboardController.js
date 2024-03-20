const {
  getPlayerStatAverages,
  getPlayerPoints,
  getPlayerMiscStats,
} = require("../db/dashboard");

// given an array and a key, create a map with the key as the key in the map and the rest as a value
const pivot = (arr, key) => {
  return arr.reduce((acc, elem) => {
    acc.set(elem.player_id, elem);
    return acc;
  }, new Map());
};

async function getAllPlayerStats(req, res) {
  const gameId = req.query?.gameId;

  try {
    const playerStatAverages = await getPlayerStatAverages(gameId);

    const playerPoints = await getPlayerPoints(gameId);
    const playerPointsPivot = pivot(playerPoints);

    const playerMiscStats = await getPlayerMiscStats(gameId);
    const playerMiscStatsPivot = pivot(playerMiscStats);

    // join all the objects on player_id
    const result = playerStatAverages.map((e) => {
      const player_id = e.player_id;
      return {
        ...e,
        ...playerPointsPivot.get(player_id),
        ...playerMiscStatsPivot.get(player_id),
      };
    });

    res.send({ results: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error " + err);
  }
}

module.exports = {
  getAllPlayerStats,
};