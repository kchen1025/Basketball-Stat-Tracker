const {
  getPlayerStatAverages,
  getPlayerPoints,
  getPlayerMiscStats,
  getPlayerWins,
} = require("../db/dashboard");

const { pivot } = require("../utils");

async function getAllPlayerStats(req, res) {
  const gameId = req.query?.gameId;
  const { startDate, endDate } = req.query;

  try {
    const playerStatAverages = await getPlayerStatAverages({
      gameId,
      startDate,
      endDate,
    });

    const playerPoints = await getPlayerPoints({ gameId, startDate, endDate });
    const playerPointsPivot = pivot(playerPoints);

    const playerMiscStats = await getPlayerMiscStats({
      gameId,
      startDate,
      endDate,
    });
    const playerMiscStatsPivot = pivot(playerMiscStats);

    const playerWins = await getPlayerWins({ gameId, startDate, endDate });
    const playerWinsPivot = pivot(playerWins);

    // join all the objects on player_id
    const result = playerStatAverages.map((e) => {
      const player_id = e.player_id;
      return {
        ...e,
        ...playerPointsPivot.get(player_id),
        ...playerMiscStatsPivot.get(player_id),
        ...playerWinsPivot.get(player_id),
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
