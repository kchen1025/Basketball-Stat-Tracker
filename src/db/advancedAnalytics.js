const db = require("./index.js");

async function getWinRateWithPlayersLeaderboardDB() {
  const { rows } = await db.query(`
    WITH PlayerPairs AS (
        SELECT
            pt1.player_id AS player1_id,
            pt2.player_id AS player2_id,
            pt1.team_id,
            COUNT(DISTINCT g.id) FILTER (WHERE g.winner = pt1.team_id) AS wins,
            COUNT(DISTINCT g.id) FILTER (WHERE g.winner != pt1.team_id AND (g.team1 = pt1.team_id OR g.team2 = pt1.team_id)) AS losses
        FROM
            player_team pt1
        JOIN
            player_team pt2 ON pt1.team_id = pt2.team_id AND pt1.player_id < pt2.player_id
        JOIN
            game g ON g.team1 = pt1.team_id OR g.team2 = pt1.team_id
        GROUP BY
            pt1.player_id, pt2.player_id, pt1.team_id
    ), WinRateCalc AS (
        SELECT
            player1_id,
            player2_id,
            SUM(wins) AS total_wins,
            SUM(losses) AS total_losses,
            CASE 
                WHEN SUM(wins) + SUM(losses) > 0 THEN
                    ROUND((SUM(wins)::DECIMAL / (SUM(wins) + SUM(losses))) * 100, 2)
                ELSE
                    0
            END AS win_rate_percentage
        FROM
            PlayerPairs
        GROUP BY
            player1_id, player2_id
    )
    SELECT
        p1.name AS player1_name,
        p2.name AS player2_name,
        WRC.total_wins,
        WRC.total_losses,
        WRC.win_rate_percentage AS win_rate
    FROM
        WinRateCalc WRC
    JOIN
        player p1 ON WRC.player1_id = p1.id
    JOIN
        player p2 ON WRC.player2_id = p2.id
    ORDER BY
        WRC.win_rate_percentage DESC,  WRC.total_losses, player1_name, player2_name;
  `);
  return rows;
}

async function getWinRateAgainstPlayerDB(playerId) {
  const { rows } = await db.query(
    `
    WITH RelevantGames AS (
        SELECT
            g.id AS game_id,
            CASE WHEN pt.team_id = g.team1 THEN g.team1 ELSE g.team2 END AS player_team,
            CASE WHEN pt.team_id = g.team1 THEN g.team2 ELSE g.team1 END AS opponent_team,
            pt.player_id,
            g.winner
        FROM
            game g
        JOIN
            player_team pt ON pt.team_id IN (g.team1, g.team2)
        WHERE EXISTS (
            SELECT 1
            FROM player_team pt2
            WHERE pt2.player_id = $1
            AND pt2.team_id IN (g.team1, g.team2)
            AND pt2.team_id != pt.team_id
        )
    ),
    WinLoss AS (
        SELECT
            rg.player_id,
            COUNT(*) FILTER (WHERE rg.winner = rg.player_team) AS wins,
            COUNT(*) FILTER (WHERE rg.winner != rg.player_team) AS losses
        FROM
            RelevantGames rg
        GROUP BY rg.player_id
    ),
    WinRate AS (
        SELECT
            wl.player_id,
            wl.wins,
            wl.losses,
            ROUND((CASE WHEN wl.wins + wl.losses > 0 THEN wl.wins::NUMERIC / (wl.wins + wl.losses) ELSE 0 END) * 100, 2) AS win_percentage
        FROM WinLoss wl
    )
    SELECT
        p.name AS player_name,
        wr.wins,
        wr.losses,
        wr.win_percentage AS win_rate
    FROM
        WinRate wr
    JOIN
        Player p ON wr.player_id = p.id
    ORDER BY
        wr.win_percentage DESC, wr.wins DESC;
  `,
    [playerId]
  );
  return rows;
}

module.exports = {
  getWinRateWithPlayersLeaderboardDB,
  getWinRateAgainstPlayerDB,
};
