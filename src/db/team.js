const db = require("./index.js");

async function createTeamDB(playerIds, gameId, teamNum) {
  try {
    await db.query("BEGIN");

    // Check if player_signature already exists
    const { rows: existingTeam } = await db.query(
      "SELECT * FROM team WHERE player_signature = $1",
      [playerIds]
    );

    if (existingTeam.length > 0) {
      // player_signature already exists, return the existing team
      await db.query("COMMIT"); // Commit transaction to release locks, if any
      return existingTeam[0];
    }

    // Fetch player names based on IDs
    const { rows: players } = await db.query(
      "SELECT id, name FROM player WHERE id = ANY($1) ORDER BY id",
      [playerIds]
    );

    const playerNames = players.map((player) => player.name);
    const teamName = playerNames.join(",");

    // Insert into the team table
    const {
      rows: [newTeam],
    } = await db.query(
      "INSERT INTO team (name, player_signature) VALUES ($1, $2) RETURNING *",
      [teamName, playerIds]
    );

    // Insert relationships into player_team table
    for (const playerId of playerIds) {
      await db.query(
        "INSERT INTO player_team (player_id, team_id) VALUES ($1, $2)",
        [playerId, newTeam.id]
      );
    }

    let dbQuery = "";
    if (teamNum === "one") {
      dbQuery = "UPDATE game set team1=$1 WHERE id = $2";
    }
    if (teamNum === "two") {
      dbQuery = "UPDATE game set team2=$1 WHERE id = $2";
    }

    // update team id FK relationship to the game row
    await db.query(dbQuery, [newTeam.id, gameId]);

    await db.query("COMMIT");
    return newTeam;
  } catch (e) {
    await db.query("ROLLBACK");
    throw e;
  }
}

module.exports = {
  createTeamDB,
};
