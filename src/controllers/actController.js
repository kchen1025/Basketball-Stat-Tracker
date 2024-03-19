const { createActDB } = require("../db/act");

async function createAct(req, res) {
  try {
    const { player_id, act_type, date, game_id, team_id } = req.body;
    if (!player_id || !act_type || !date || !game_id || !team_id) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const results = await createActDB(
      player_id,
      act_type,
      date,
      game_id,
      team_id
    );
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

module.exports = {
  createAct,
};
