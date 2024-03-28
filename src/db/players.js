const db = require("./index.js");

async function getAllPlayers() {
  const { rows } = await db.query("SELECT * FROM player");
  return rows;
}

async function createPlayerDB(player_name) {
  const { rows } = await db.query(
    "insert into player(name) values ($1) returning *",
    [player_name]
  );
  return rows;
}

async function getCareerHighsDB() {
  const { rows } = await db.query(
    `
  WITH PointsPerGame AS (
      SELECT
          a.player_id,
          a.game_id,
          SUM(CASE WHEN a.act_type = 'twoPtMake' THEN 2 WHEN a.act_type = 'threePtMake' THEN 3 ELSE 0 END) AS points
      FROM
          act a
      GROUP BY
          a.player_id, a.game_id
  ), MaxPoints AS (
      SELECT
          pg.player_id,
          pg.game_id,
          MAX(pg.points) AS career_high_points
      FROM
          PointsPerGame pg
      INNER JOIN (
          SELECT
              player_id,
              MAX(points) AS max_points
          FROM
              PointsPerGame
          GROUP BY
              player_id
      ) AS max_pg ON pg.player_id = max_pg.player_id AND pg.points = max_pg.max_points
      GROUP BY
          pg.player_id, pg.game_id
  )
  SELECT
      p.id AS player_id,
      p.name,
      mp.career_high_points,
      g.name AS game_name,
      g.date AS game_date
  FROM
      MaxPoints mp
  JOIN
      player p ON mp.player_id = p.id
  JOIN
      game g ON mp.game_id = g.id
  ORDER BY
      p.name;
  `,
    []
  );
  return rows;
}

async function getPointsByPlayerDB(playerId) {
  const { rows } = await db.query(
    `WITH PlayerPointsPerGame AS (
    SELECT
        a.player_id,
        a.game_id,
        g.name as game_name,
        g.date AS game_date,
        SUM(CASE 
            WHEN a.act_type = 'twoPtMake' THEN 2 
            WHEN a.act_type = 'threePtMake' THEN 3 
            ELSE 0 
        END) AS points
    FROM
        act a
    JOIN
        game g ON a.game_id = g.id
    WHERE
        a.player_id = $1 
    GROUP BY
        a.player_id, a.game_id, g.date, g.name
)
SELECT
    pg.player_id,
    pg.game_id,
    pg.game_name,
    pg.game_date,    
    pg.points
FROM
    PlayerPointsPerGame pg
ORDER BY
    pg.game_date, pg.game_id;`,
    [playerId]
  );
  return rows;
}

module.exports = {
  getAllPlayers,
  createPlayerDB,
  getCareerHighsDB,
  getPointsByPlayerDB,
};
