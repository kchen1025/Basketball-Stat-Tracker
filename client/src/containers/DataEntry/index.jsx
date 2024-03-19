import {
  Grid,
  Box,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Button,
  Divider,
} from "@mui/joy";
import { format } from "date-fns";
import { useLoaderData } from "react-router-dom";
import { getGame, getGameMetaData, getGameLog } from "@/api/game";
import { createTeam } from "@/api/team";
import { getAllPlayers } from "@/api/player";
import { useState, useEffect } from "react";

import ButtonBlock from "@/components/ButtonBlock";
import InputAutocomplete from "@/components/InputAutocomplete";
import PlayerStatsTable from "@/components/PlayerStatsTable";

const BLANK_PLAYER = {
  assists: 0,
  blocks: 0,
  fga: 0,
  fgm: 0,
  points: 0,
  rebounds: 0,
  steals: 0,
  tpa: 0,
  tpm: 0,
  turnovers: 0,
  game_date: null,
  game_name: null,
  game_outcome: null,
  player_id: null,
  player_name: null,
  team_id: null,
  team_name: null,
  winning_team_name: null,
};

const TEAM = {
  one: "one",
  two: "two",
};

export async function loader({ params }) {
  const { results: gameData } = await getGame(params.gameId);
  const { results: gameResults } = await getGameMetaData(params.gameId);
  const { results: gameLog } = await getGameLog(params.gameId);
  const { results: allPlayers } = await getAllPlayers();
  console.log(gameLog);
  // if we get values, populate the page and allow editing of the game.
  // if we don't get any values but we have a game, allow the editing of the game

  return { allPlayers, gameData, gameResults, gameLog };
}

const getDate = (gameData) => {
  if (gameData && gameData.length) {
    const date = gameData[0]?.date;
    return date ? format(date, "yyyy-M-d") : null;
  }
  return null;
};

const getGameName = (gameData) => {
  if (gameData && gameData.length) {
    return gameData[0]?.name;
  }
  return null;
};

const getGameId = (gameData) => {
  if (gameData && gameData.length) {
    return gameData[0]?.id;
  }
  return null;
};

const setTeamPlayers = (
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

const setGameStatsTeamId = (
  teamPlayers,
  teamId,
  { gameStats, setGameStats }
) => {
  console.log(gameStats);
  const newGameStats = gameStats.reduce((acc, e) => {
    if (teamPlayers.includes(e.player_id)) {
      acc.push({ ...e, team_id: teamId });
    } else {
      acc.push({ ...e });
    }
    return acc;
  }, []);
  console.log(newGameStats);
  setGameStats(newGameStats);
};

const DataEntry = () => {
  const { allPlayers, gameData, gameResults, gameLog } = useLoaderData();
  const [gameOriginalData, setGameOriginalData] = useState([]);
  console.log(gameData);
  const [players, setPlayers] = useState([]);
  const [gameStats, setGameStats] = useState([]);
  const [gameLogData, setGameLogData] = useState([]);
  const [team1Id, setTeam1Id] = useState(0);
  const [team2Id, setTeam2Id] = useState(0);
  const [winnerTeamId, setWinnerTeamId] = useState(-1);

  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);

  useEffect(() => {
    setGameStats(gameResults);
    setGameLogData(gameLog);
    setGameOriginalData(gameData);
    setPlayers(allPlayers);

    // if we don't have teams link to the actual game record, means this is a new game
    // ignore everything else here
    // if (!gameData[0].winner) {
    //   return;
    // }

    const teams = gameResults.reduce((acc, elem) => {
      if (elem.team_id) {
        acc.add(elem.team_id);
      }
      return acc;
    }, new Set());

    if (teams.size == 2) {
      const [team1, team2] = [...teams];

      setTeam1Id(team1);
      setTeam2Id(team2);

      // now pull a winner
      const winner = gameResults.find((e) => e.game_outcome === "Won");
      if (winner.team_id && teams.has(winner.team_id)) {
        setWinnerTeamId(winner.team_id);
      }

      // divide up the game stats by the inidividual teams
      setTeamPlayers(gameResults, {
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

  const handleConfirmTeam = (teamPlayers, setTeamId, teamNum) => async () => {
    const { results: team } = await createTeam(
      teamPlayers,
      gameData[0]?.id,
      teamNum
    );
    const { id: teamId } = team;
    setTeamId(teamId);

    // set the players on our stats to this team id
    setGameStatsTeamId(teamPlayers, teamId, { gameStats, setGameStats });

    // refresh the game data
  };

  return (
    <Grid container justifyContent="center" margin={5}>
      <Box justifyContent="center" margin={3}>
        <Box display="flex" justifyContent="center" gap={10} marginBottom={2}>
          <Typography level="h3">
            Date:{" "}
            <Typography level="body-lg">
              {getDate(gameData) || "N/A"}
            </Typography>
          </Typography>
          <Typography level="h3">
            Game Name:{" "}
            <Typography level="body-lg">
              {getGameName(gameData) || "N/A"}
            </Typography>
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent={"space-around"}
          marginTop={5}
          gap={2}
        >
          <Box display="flex" flexDirection={"column"} justifyContent="center">
            <Typography level="h2">Team 1</Typography>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <InputAutocomplete
              players={players}
              onExistingPlayerSelected={handleExistingPlayerAdded(
                team1Players,
                setTeam1Players,
                team1Id
              )}
            />
            {gameStats
              .filter((e) => team1Players.includes(e.player_id))
              .map((e, i) => {
                return (
                  <ButtonBlock
                    key={`${e.player_name}-${i}`}
                    name={e.player_name}
                    playerId={e.player_id}
                    teamId={team1Id}
                    gameStats={gameStats}
                    setGameStats={setGameStats}
                    gameLogData={gameLogData}
                    setGameLogData={setGameLogData}
                    date={getDate(gameData)}
                    gameId={getGameId(gameData)}
                  />
                );
              })}
            {!team1Id && gameStats.length ? (
              <Button
                color="success"
                onClick={handleConfirmTeam(team1Players, setTeam1Id, TEAM.one)}
              >
                Confirm Team 1?
              </Button>
            ) : null}
          </Box>
          <Box display="flex" flexDirection={"column"} justifyContent="center">
            <Typography level="h2">Team 2</Typography>
            <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
            <InputAutocomplete
              players={players}
              onExistingPlayerSelected={handleExistingPlayerAdded(
                team2Players,
                setTeam2Players,
                team2Id
              )}
            />
            {gameStats
              .filter((e) => team2Players.includes(e.player_id))
              .map((e, i) => {
                return (
                  <ButtonBlock
                    key={`${e.player_name}-${i}`}
                    name={e.player_name}
                    playerId={e.player_id}
                    teamId={team2Id}
                    gameStats={gameStats}
                    setGameStats={setGameStats}
                    gameLogData={gameLogData}
                    setGameLogData={setGameLogData}
                    date={getDate(gameData)}
                    gameId={getGameId(gameData)}
                  />
                );
              })}
            {!team2Id && gameStats.length ? (
              <Button
                color="success"
                onClick={handleConfirmTeam(team2Players, setTeam2Id, TEAM.two)}
              >
                Confirm Team 2?
              </Button>
            ) : null}
          </Box>
        </Box>

        <Box display="flex" marginTop={5}>
          <PlayerStatsTable
            team1Id={team1Id}
            team2Id={team2Id}
            winnerTeamId={winnerTeamId}
            gameStats={gameStats}
          />
        </Box>

        <Box display="flex" justifyContent="center">
          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent="center"
            marginTop={5}
          >
            {gameLogData.map((e, i) => {
              return (
                <Box key={`log-${i}`}>
                  {e.player_name}: {e.act_type}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default DataEntry;
