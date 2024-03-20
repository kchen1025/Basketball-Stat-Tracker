const setBothTeamPlayers = (
  gameResults,
  { team1, team2, setTeam1Players, setTeam2Players }
) => {
  setTeam1Players([
    ...gameResults.reduce((acc, e) => {
      if (e.team_id === team1) {
        acc.push(e.player_id);
      }
      return acc;
    }, []),
  ]);
  setTeam2Players([
    ...gameResults.reduce((acc, e) => {
      if (e.team_id === team2) {
        acc.push(e.player_id);
      }
      return acc;
    }, []),
  ]);
};

// takes the game stats, and pulls the unique team id's out of the stats
const composeTeams = (stats) => {
  return stats.reduce((acc, elem) => {
    if (elem.team_id) {
      acc.add(elem.team_id);
    }
    return acc;
  }, new Set());
};

const getWinner = (stats) => {
  return stats.find((e) => e.game_outcome === "Won");
};

const isWinnerInTeams = (winner, teams) => {
  return winner && winner.team_id && teams.has(winner.team_id);
};

const areTeamsAvailable = (team1Id, team2Id, gameStats) => {
  return (!team1Id || !team2Id) && gameStats.length;
};

const isEitherTeamEmpty = (team1Players, team2Players) =>
  team1Players.length == 0 || team2Players.length == 0;

export {
  setBothTeamPlayers,
  composeTeams,
  getWinner,
  isWinnerInTeams,
  areTeamsAvailable,
  isEitherTeamEmpty,
};
