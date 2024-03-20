import { Grid, Box, Button, Typography } from "@mui/joy";
import { useLoaderData } from "react-router-dom";
import { getGame, getGameMetaData, getGameLog } from "@/api/game";
import { createTeams } from "@/api/team";
import { getAllPlayers, createPlayer } from "@/api/player";
import { useState, useEffect } from "react";
import { useSnackbar } from "@/context/SnackbarContext";

import TeamSelection from "./components/TeamSelection";
import DataEntryHeader from "./components/DataEntryHeader";
import GameActivityLog from "./components/GameActivityLog";
import PlayerStatsTable from "@/components/PlayerStatsTable";
import { BLANK_PLAYER } from "@/constants";
import {
  getGameId,
  setBothTeamPlayers,
  composeTeams,
  getWinner,
  isWinnerInTeams,
  areTeamsAvailable,
  isEitherTeamEmpty,
} from "./utils";

// react router loader hooked up in App.jsx
export async function loader({ params }) {
  const { results: gameData } = await getGame(params.gameId);
  const { results: gameResults } = await getGameMetaData(params.gameId);
  const { results: gameLog } = await getGameLog(params.gameId);
  const { results: allPlayers } = await getAllPlayers();

  return { allPlayers, gameData, gameResults, gameLog };
}

const handleNewPlayerAdded =
  ({
    players,
    setPlayers,
    teamPlayers,
    setTeamPlayers,
    teamId,
    gameStats,
    setGameStats,
    triggerSnackbar,
  }) =>
  async (playerName) => {
    try {
      // run api call to add player
      const { results } = await createPlayer({ playerName });

      // add to players
      setPlayers([...players, ...results]);

      const { id: newPlayerId, name: newPlayerName } = results[0];

      // also add to team 1????
      setTeamPlayers([...teamPlayers, newPlayerId]);

      // add an empty object for that new player to their team
      setGameStats([
        ...gameStats,
        {
          ...BLANK_PLAYER,
          player_id: newPlayerId,
          player_name: newPlayerName,
          team_id: teamId,
        },
      ]);
    } catch (err) {
      console.error(err);
      triggerSnackbar({
        message:
          "Something went wrong with creating a player (do they already exist?)",
      });
    }
  };

const DataEntry = () => {
  const { allPlayers, gameData, gameResults, gameLog } = useLoaderData();

  const [players, setPlayers] = useState([]);
  const [gameStats, setGameStats] = useState([]);
  const [gameActivityLog, setGameActivityLog] = useState([]);
  const [team1Id, setTeam1Id] = useState(0);
  const [team2Id, setTeam2Id] = useState(0);
  const [winnerTeamId, setWinnerTeamId] = useState(-1);

  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);

  const { triggerSnackbar } = useSnackbar();

  useEffect(() => {
    setGameStats(gameResults);
    setGameActivityLog(gameLog);
    setPlayers(allPlayers);

    // if we don't have teams link to the actual game record, means this is a new game
    // ignore everything else here
    // if (!gameData[0].winner) {
    //   return;
    // }

    const teamsSet = composeTeams(gameResults);

    if (teamsSet.size == 2) {
      const [team1, team2] = [...teamsSet];

      setTeam1Id(team1);
      setTeam2Id(team2);

      // now pull a winner
      const winner = getWinner(gameResults);
      if (isWinnerInTeams(winner, teamsSet)) {
        setWinnerTeamId(winner.team_id);
      }

      // divide up the game stats by the inidividual teams
      setBothTeamPlayers(gameResults, {
        team1,
        team2,
        setTeam1Players,
        setTeam2Players,
      });
    }
  }, [gameResults]);

  const handleExistingPlayerAdded =
    (teamPlayers, setPlayers, teamId) => (existingPlayer) => {
      if (!existingPlayer) return;

      const { id, name } = existingPlayer;
      setPlayers([...teamPlayers, id]);

      setGameStats([
        ...gameStats,
        { ...BLANK_PLAYER, player_id: id, player_name: name, team_id: teamId },
      ]);
    };

  const setGameStatsTeamId = (team1Players, team2Players, team1Id, team2Id) => {
    const newGameStats = gameStats.reduce((acc, e) => {
      if (team1Players.includes(e.player_id)) {
        acc.push({ ...e, team_id: team1Id });
      } else if (team2Players.includes(e.player_id)) {
        acc.push({ ...e, team_id: team2Id });
      } else {
        acc.push({ ...e });
      }
      return acc;
    }, []);

    setGameStats([...newGameStats]);
  };

  const handleConfirmTeams = async () => {
    if (isEitherTeamEmpty(team1Players, team2Players)) {
      triggerSnackbar({
        message: "Both teams must have players before confirming",
      });
      return;
    }

    const { results: teams } = await createTeams({
      team1PlayerIds: team1Players,
      team2PlayerIds: team2Players,
      gameId: getGameId(gameData),
    });

    if (teams.length != 2) {
      console.error("something went wrong with team creation");
      return;
    }

    const team1 = teams[0];
    const team2 = teams[1];

    setTeam1Id(team1.id);
    setTeam2Id(team2.id);

    // set the players on our stats to this team id
    setGameStatsTeamId(team1Players, team2Players, team1.id, team2.id);

    // refresh the game data
  };

  return (
    <Grid container justifyContent="center" margin={5}>
      <Box justifyContent="center" margin={3}>
        <DataEntryHeader gameData={gameData} />

        <Box display="flex" flexDirection={"column"} alignItems={"center"}>
          <Box
            display="flex"
            justifyContent={"space-around"}
            marginTop={5}
            gap={2}
          >
            <TeamSelection
              players={players}
              teamPlayers={team1Players}
              allSelectedPlayers={team1Players.concat(team2Players)}
              teamId={team1Id}
              gameStats={gameStats}
              setGameStats={setGameStats}
              gameActivityLog={gameActivityLog}
              setGameActivityLog={setGameActivityLog}
              gameData={gameData}
              onExistingPlayerSelected={handleExistingPlayerAdded(
                team1Players,
                setTeam1Players,
                team1Id
              )}
              onNewPlayerAdded={handleNewPlayerAdded({
                players,
                setPlayers,
                teamPlayers: team1Players,
                setTeamPlayers: setTeam1Players,
                teamId: team1Id,
                gameStats,
                setGameStats,
                triggerSnackbar,
              })}
              header={<Typography level="h2">Team 1</Typography>}
            />
            <TeamSelection
              players={players}
              teamPlayers={team2Players}
              allSelectedPlayers={team1Players.concat(team2Players)}
              teamId={team2Id}
              gameStats={gameStats}
              setGameStats={setGameStats}
              gameActivityLog={gameActivityLog}
              setGameActivityLog={setGameActivityLog}
              gameData={gameData}
              onExistingPlayerSelected={handleExistingPlayerAdded(
                team2Players,
                setTeam2Players,
                team2Id
              )}
              onNewPlayerAdded={handleNewPlayerAdded({
                players,
                setPlayers,
                teamPlayers: team2Players,
                setTeamPlayers: setTeam2Players,
                teamId: team2Id,
                gameStats,
                setGameStats,
                triggerSnackbar,
              })}
              header={<Typography level="h2">Team 2</Typography>}
            />
          </Box>
          {areTeamsAvailable(team1Id, team2Id, gameStats) ? (
            <Button
              color="success"
              sx={{ width: 600 }}
              onClick={handleConfirmTeams}
            >
              Confirm Teams?
            </Button>
          ) : null}
        </Box>

        <Box marginTop={5}>
          <PlayerStatsTable
            team1Id={team1Id}
            team2Id={team2Id}
            winnerTeamId={winnerTeamId}
            gameStats={gameStats}
          />
        </Box>

        <Box
          display="flex"
          flexDirection={"column"}
          alignItems={"center"}
          marginTop={5}
        >
          <GameActivityLog gameActivityLog={gameActivityLog} />
        </Box>
      </Box>
    </Grid>
  );
};

export default DataEntry;
