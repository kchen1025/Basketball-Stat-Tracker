const { createTeamDB, createTeamsDB } = require("../db/team");

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

async function createTeams(req, res) {
  try {
    const { team1_player_ids, team2_player_ids, game_id } = req.body;
    if (!team1_player_ids || !team2_player_ids || !game_id) {
      return res.status(400).send({ error: "Missing required fields" });
    }
    const team1PlayerIds = team1_player_ids.sort((a, b) => a - b);
    const team2PlayerIds = team2_player_ids.sort((a, b) => a - b);

    const results = await createTeamsDB(
      team1PlayerIds,
      team2PlayerIds,
      game_id
    );
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

module.exports = {
  createTeam,
  createTeams,
};
