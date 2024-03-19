const { createTeamDB } = require("../db/team");

async function createTeam(req, res) {
  try {
    if (!req.body.playerIds || !req.body.gameId || !req.body.teamNum) {
      return res.status(400).send({ error: "Missing required fields" });
    }
    const playerIds = req.body.playerIds.sort((a, b) => a - b);
    const results = await createTeamDB(
      playerIds,
      req.body.gameId,
      req.body.teamNum
    );
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

module.exports = {
  createTeam,
};
