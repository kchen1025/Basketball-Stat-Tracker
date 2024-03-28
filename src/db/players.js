const db = require("./index.js");
const { ACTION_TYPES } = require("../constants");

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

async function getChartStatsByPlayerDB(playerId, actionType = null) {
  let query = `
  WITH PlayerPointsPerGame AS (
      SELECT
          a.player_id,
          a.game_id,
          g.name as game_name,
          g.date AS game_date,
          @@STAT_CONDITION@@
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
      pg.stat
  FROM
      PlayerPointsPerGame pg
  ORDER BY
      pg.game_date, pg.game_id;`;

  switch (actionType) {
    case ACTION_TYPES.assist:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'assist' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.steal:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'steal' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.turnover:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'turnover' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.rebound:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'rebound' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.twoPtMiss:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'twoPtMiss' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.threePtMiss:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'threePtMiss' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.twoPtMake:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'twoPtMake' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.threePtMake:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'threePtMake' then 1 else 0 end ) as stat`
      );
      break;
    case ACTION_TYPES.block:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(case when a.act_type = 'block' then 1 else 0 end ) as stat`
      );
      break;
    default:
      query = query.replace(
        "@@STAT_CONDITION@@",
        `SUM(CASE 
              WHEN a.act_type = 'twoPtMake' THEN 2 
              WHEN a.act_type = 'threePtMake' THEN 3 
              ELSE 0 
          END) AS stat`
      );
      break;
  }

  const { rows } = await db.query(query, [playerId]);
  return rows;
}

module.exports = {
  getAllPlayers,
  createPlayerDB,
  getCareerHighsDB,
  getChartStatsByPlayerDB,
};
