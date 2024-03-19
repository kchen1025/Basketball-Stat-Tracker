const db = require("./index.js");

async function createActDB(player_id, act_type, date, game_id, team_id) {
  const { rows } = await db.query(
    `
    INSERT INTO act 
    ( 
      player_id, 
      act_type,
      date,
      game_id,
      team_id
    ) 
    VALUES 
    ( 
      $1, 
      $2,
      $3,
      $4,
      $5
    ) 
    returning id;
  `,
    [player_id, act_type, date, game_id, team_id]
  );
  return rows;
}

module.exports = {
  createActDB,
};
