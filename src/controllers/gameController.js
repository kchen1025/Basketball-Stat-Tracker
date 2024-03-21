const { deleteGameDB } = require("../db/game");

async function deleteGame(req, res) {
  try {
    const results = await deleteGameDB(req.params.gameId);
    res.status(200).send({ results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred" });
  }
}

module.exports = {
  deleteGame,
};
