const {
  getWinRateWithPlayersLeaderboardDB,
  getWinRateAgainstPlayerDB,
} = require("../db/advancedAnalytics");

async function getWinRateWithPlayersLeaderboard(req, res) {
  try {
    const results = await getWinRateWithPlayersLeaderboardDB();
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

async function getWinRateAgainstPlayer(req, res) {
  try {
    const results = await getWinRateAgainstPlayerDB(req.params.playerId);
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

module.exports = {
  getWinRateWithPlayersLeaderboard,
  getWinRateAgainstPlayer,
};
