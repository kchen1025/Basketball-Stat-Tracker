const db = require("./index.js");

async function getAllGames() {
  const { rows } = await db.query("select * from game");
  return rows;
}

async function createGameDB(name, date) {
  const { rows } = await db.query(
    `
    INSERT INTO game 
    ( 
      name, 
      date 
    ) 
    VALUES 
    ( 
      $1, 
      $2
    ) 
    returning id;
  `,
    [name, date]
  );
  return rows;
}

async function getGameDB(gameId) {
  const { rows } = await db.query(
    `
    select * from game where id=$1;
  `,
    [gameId]
  );
  return rows;
}

async function getGetMetaDataDB(gameId) {
  const { rows } = await db.query(
    `
    WITH GameStats AS (
      SELECT
          a.player_id,
          a.team_id,
          a.game_id,
          g.winner AS winning_team_id,
          g.name AS game_name,
          g.date AS game_date,
          COUNT(CASE WHEN a.act_type = 'rebound' THEN 1 END) AS rebounds,
          COUNT(CASE WHEN a.act_type = 'assist' THEN 1 END) AS assists,
          COUNT(CASE WHEN a.act_type = 'steal' THEN 1 END) AS steals,
          COUNT(CASE WHEN a.act_type = 'block' THEN 1 END) AS blocks,
          COUNT(CASE WHEN a.act_type = 'turnover' THEN 1 END) AS turnovers,
          SUM(CASE WHEN a.act_type = 'twoPtMake' THEN 2 WHEN a.act_type = 'threePtMake' THEN 3 ELSE 0 END) AS points,
          COUNT(CASE WHEN a.act_type = 'threePtMake' THEN 1 END) AS threePM,
          COUNT(CASE WHEN a.act_type IN ('threePtMake', 'threePtMiss') THEN 1 END) AS threePA,
          COUNT(CASE WHEN a.act_type IN ('twoPtMake', 'threePtMake') THEN 1 END) AS FGM,
          COUNT(CASE WHEN a.act_type IN ('twoPtMake', 'twoPtMiss', 'threePtMake', 'threePtMiss') THEN 1 END) AS FGA
      FROM
          act a
      JOIN
          game g ON a.game_id = g.id
      WHERE
          a.game_id = $1 
      GROUP BY
          a.player_id, a.team_id, a.game_id, g.winner, g.name, g.date
  )
  SELECT
      p.id AS player_id,
      p.name AS player_name,
      t.id AS team_id,
      t.name AS team_name,
      gs.game_name,
      gs.game_date,
      gs.rebounds,
      gs.assists,
      gs.steals,
      gs.blocks,
      gs.turnovers,
      gs.points,
      gs.threePM AS "tpm",
      gs.threePA AS "tpa",
      gs.FGM,
      gs.FGA,
      (CASE WHEN gs.winning_team_id = gs.team_id THEN 'Won' ELSE 'Lost' END) AS game_outcome,
      (SELECT name FROM team WHERE id = gs.winning_team_id) AS winning_team_name
  FROM
      GameStats gs
  JOIN
      player p ON gs.player_id = p.id
  JOIN
      team t ON gs.team_id = t.id
  ORDER BY
      t.id, p.name;
  `,
    [gameId]
  );
  return rows;
}

async function getGameLogDB(gameId) {
  const { rows } = await db.query(
    `
    select p.id as player_id,p.name as player_name,a.act_type from act a join player p on p.id=a.player_id where a.game_id=$1 order by a.id asc;
  `,
    [gameId]
  );
  return rows;
}

module.exports = {
  getAllGames,
  createGameDB,
  getGetMetaDataDB,
  getGameLogDB,
  getGameDB,
};
