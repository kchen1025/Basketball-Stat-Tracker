const db = require("./index.js");

async function getPlayerStatAverages({ gameId, startDate, endDate }) {
  let query = `
  WITH PlayerActions AS (
      SELECT
          a.player_id,
          a.game_id,
          SUM(CASE WHEN a.act_type IN ('twoPtMake', 'threePtMake') THEN 1 ELSE 0 END) AS FGM,
          SUM(CASE WHEN a.act_type IN ('twoPtMiss', 'twoPtMake', 'threePtMiss', 'threePtMake') THEN 1 ELSE 0 END) AS FGA,
          SUM(CASE WHEN a.act_type = 'threePtMake' THEN 1 ELSE 0 END) AS THREE_PM,
          SUM(CASE WHEN a.act_type IN ('threePtMiss', 'threePtMake') THEN 1 ELSE 0 END) AS THREE_PA,
          SUM(CASE WHEN a.act_type = 'rebound' THEN 1 ELSE 0 END) AS REB,
          SUM(CASE WHEN a.act_type = 'assist' THEN 1 ELSE 0 END) AS AST,
          SUM(CASE WHEN a.act_type = 'steal' THEN 1 ELSE 0 END) AS STL,
          SUM(CASE WHEN a.act_type = 'block' THEN 1 ELSE 0 END) AS BLK,
          SUM(CASE WHEN a.act_type = 'turnover' THEN 1 ELSE 0 END) AS TO,
          SUM(CASE WHEN a.act_type = 'twoPtMake' THEN 2 WHEN a.act_type = 'threePtMake' THEN 3 ELSE 0 END) AS PTS
      FROM
          act a
      @@JOIN_CONDITION@@
      GROUP BY
          a.player_id, a.game_id
  ), PlayerGameCounts AS (
      SELECT
          player_id,
          COUNT(game_id) AS games_played
      FROM
          PlayerActions
      GROUP BY
          player_id
  ), PlayerAverages AS (
      SELECT
          pa.player_id,
          SUM(pa.FGM) / NULLIF(pgc.games_played, 0) AS avg_FGM,
          SUM(pa.FGA) / NULLIF(pgc.games_played, 0) AS avg_FGA,
          SUM(pa.THREE_PM) / NULLIF(pgc.games_played, 0) AS avg_THREE_PM,
          SUM(pa.THREE_PA) / NULLIF(pgc.games_played, 0) AS avg_THREE_PA,
          SUM(pa.REB) / NULLIF(pgc.games_played, 0) AS avg_REB,
          SUM(pa.AST) / NULLIF(pgc.games_played, 0) AS avg_AST,
          SUM(pa.STL) / NULLIF(pgc.games_played, 0) AS avg_STL,
          SUM(pa.BLK) / NULLIF(pgc.games_played, 0) AS avg_BLK,
          SUM(pa.TO) / NULLIF(pgc.games_played, 0) AS avg_TO,
          SUM(pa.PTS) / NULLIF(pgc.games_played, 0) AS avg_PTS
      FROM
          PlayerActions pa
      JOIN
          PlayerGameCounts pgc ON pa.player_id = pgc.player_id
      GROUP BY
          pa.player_id, pgc.games_played
  )
  SELECT
      p.id AS player_id,
      p.name AS player_name,
      ROUND(avg_FGM, 2) AS avg_FGM_per_game,
      ROUND(avg_FGA, 2) AS avg_FGA_per_game,
      ROUND(avg_THREE_PM, 2) AS avg_THREE_PM_per_game,
      ROUND(avg_THREE_PA, 2) AS avg_THREE_PA_per_game,
      ROUND(avg_REB, 2) AS avg_REB_per_game,
      ROUND(avg_AST, 2) AS avg_AST_per_game,
      ROUND(avg_STL, 2) AS avg_STL_per_game,
      ROUND(avg_BLK, 2) AS avg_BLK_per_game,
      ROUND(avg_TO, 2) AS avg_TO_per_game,
      ROUND(avg_PTS, 2) AS avg_PTS_per_game
  FROM
      PlayerAverages
  JOIN
      player p ON PlayerAverages.player_id = p.id
  ORDER BY
      p.name;`;
  const queryParams = [];

  if (gameId) {
    query = query.replace(
      "@@JOIN_CONDITION@@",
      `
      JOIN 
            game g ON a.game_id = g.id
        WHERE
            g.name LIKE $1
      `
    );
    queryParams.push(`%${gameId}%`);
  } else if (startDate && endDate) {
    query = query.replace(
      "@@JOIN_CONDITION@@",
      `JOIN
            game g ON a.game_id = g.id
        WHERE        
            g.date BETWEEN $1 AND $2
      `
    );
    queryParams.push(startDate, endDate);
  } else {
    query = query.replace("@@JOIN_CONDITION@@", "");
  }

  const { rows } = await db.query(query, queryParams);
  return rows;
}

async function getPlayerPoints({ gameId, startDate, endDate }) {
  let query = `    
    WITH ShotStats AS (
      SELECT
          a.player_id,
          SUM(CASE WHEN a.act_type IN ('twoPtMake', 'threePtMake') THEN 1 ELSE 0 END) AS field_goals_made,
          SUM(CASE WHEN a.act_type IN ('twoPtMiss', 'twoPtMake', 'threePtMiss', 'threePtMake') THEN 1 ELSE 0 END) AS field_goals_attempted,
          SUM(CASE WHEN a.act_type = 'threePtMake' THEN 1 ELSE 0 END) AS three_points_made,
          SUM(CASE WHEN a.act_type IN ('threePtMiss', 'threePtMake') THEN 1 ELSE 0 END) AS three_points_attempted            
      FROM
          act a      
      @@JOIN_CONDITION@@          
      GROUP BY
          a.player_id
    ), CalculatedStats AS (
      SELECT
          ss.*,
          ROUND((ss.field_goals_made::NUMERIC / NULLIF(ss.field_goals_attempted, 0)) * 100, 2) AS fg_percentage,
          ROUND((ss.three_points_made::NUMERIC / NULLIF(ss.three_points_attempted, 0)) * 100, 2) AS three_pt_percentage,
          ROUND(((ss.field_goals_made * 2 + ss.three_points_made) * 10000) / NULLIF((2 * ss.field_goals_attempted), 0)) / 100 AS true_shooting_percentage
      FROM
          ShotStats ss
    )
    SELECT
      p.id AS player_id,
      p.name AS player_name,
      cs.field_goals_made,
      cs.field_goals_attempted,
      cs.fg_percentage AS fg_percentage,
      cs.three_points_made,
      cs.three_points_attempted,
      cs.three_pt_percentage AS three_pt_percentage,
      cs.true_shooting_percentage AS true_shooting_percentage
    FROM
      CalculatedStats cs
    JOIN
      player p ON cs.player_id = p.id
    ORDER BY
      p.name;
  `;

  const queryParams = [];

  // if we have a game id, update the query so that we can search by it
  if (gameId) {
    query = query.replace(
      "@@JOIN_CONDITION@@",
      `JOIN 
              game g
          ON
              a.game_id = g.id
          WHERE
              g.name LIKE $1
      `
    );
    queryParams.push(`%${gameId}%`);
  } else if (startDate && endDate) {
    query = query.replace(
      "@@JOIN_CONDITION@@",
      `JOIN
            game g ON a.game_id = g.id
        WHERE        
            g.date BETWEEN $1 AND $2
      `
    );
    queryParams.push(startDate, endDate);
  } else {
    query = query.replace("@@JOIN_CONDITION@@", "");
  }

  const { rows } = await db.query(query, queryParams);
  return rows;
}

async function getPlayerMiscStats({ gameId, startDate, endDate }) {
  let query = `
    SELECT
        p.id AS player_id,
        p.name AS player_name,
        SUM(CASE WHEN a.act_type = 'rebound' THEN 1 ELSE 0 END) AS rebounds,
        SUM(CASE WHEN a.act_type = 'assist' THEN 1 ELSE 0 END) AS assists,
        SUM(CASE WHEN a.act_type = 'steal' THEN 1 ELSE 0 END) AS steals,
        SUM(CASE WHEN a.act_type = 'block' THEN 1 ELSE 0 END) AS blocks,
        SUM(CASE WHEN a.act_type = 'turnover' THEN 1 ELSE 0 END) AS turnovers,
        SUM(CASE
            WHEN a.act_type = 'twoPtMake' THEN 2
            WHEN a.act_type = 'threePtMake' THEN 3
            ELSE 0
        END) AS points
    FROM
        player p
    JOIN
        act a ON p.id = a.player_id
    @@JOIN_CONDITION@@
    GROUP BY
        p.id, p.name
    ORDER BY
        p.name;
  `;
  const queryParams = [];

  // if we have a game id, update the query so that we can search by it
  if (gameId) {
    query = query.replace(
      "@@JOIN_CONDITION@@",
      `
      JOIN 
          game g ON a.game_id = g.id
      WHERE
          g.name LIKE $1
      `
    );
    queryParams.push(`%${gameId}%`);
  } else if (startDate && endDate) {
    query = query.replace(
      "@@JOIN_CONDITION@@",
      `JOIN
            game g ON a.game_id = g.id
        WHERE        
            g.date BETWEEN $1 AND $2
      `
    );
    queryParams.push(startDate, endDate);
  } else {
    query = query.replace("@@JOIN_CONDITION@@", "");
  }

  const { rows } = await db.query(query, queryParams);
  return rows;
}

async function getPlayerWins({ gameId, startDate, endDate }) {
  let query = `
    SELECT
      p.id AS player_id,  
      COUNT(DISTINCT g.id) AS games_played,
      COUNT(DISTINCT CASE WHEN g.winner = pt.team_id THEN g.id END) AS wins,
      ROUND((COUNT(DISTINCT CASE WHEN g.winner = pt.team_id THEN g.id END) * 100.0) / NULLIF(COUNT(DISTINCT g.id), 0), 2) AS win_percentage
    FROM
      player p
    JOIN
      player_team pt ON p.id = pt.player_id    
    @@NAME_JOIN_CONDITION@@
    @@JOIN_CONDITION@@
    GROUP BY
      p.id, p.name
    ORDER BY
      win_percentage DESC, games_played DESC;
  `;

  const queryParams = [];

  // if we have a game id, update the query so that we can search by it
  if (gameId) {
    query = query.replace("@@JOIN_CONDITION@@", "");
    query = query.replace(
      "@@NAME_JOIN_CONDITION@@",
      `JOIN game g ON (pt.team_id = g.team1 OR pt.team_id = g.team2) AND g.name like $1`
    );
    queryParams.push(`%${gameId}%`);
  } else if (startDate && endDate) {
    query = query.replace(
      "@@JOIN_CONDITION@@",
      `WHERE        
            g.date BETWEEN $1 AND $2
      `
    );
    query = query.replace(
      "@@NAME_JOIN_CONDITION@@",
      `JOIN game g ON pt.team_id = g.team1 OR pt.team_id = g.team2`
    );
    queryParams.push(startDate, endDate);
  } else {
    query = query.replace("@@JOIN_CONDITION@@", "");
    query = query.replace(
      "@@NAME_JOIN_CONDITION@@",
      `JOIN game g ON pt.team_id = g.team1 OR pt.team_id = g.team2`
    );
  }

  const { rows } = await db.query(query, queryParams);
  return rows;
}

module.exports = {
  getPlayerStatAverages,
  getPlayerMiscStats,
  getPlayerPoints,
  getPlayerWins,
};
