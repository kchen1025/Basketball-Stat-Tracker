import { getWinRateAgainstPlayer } from "@/api/leaderboard";
import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import Table from "@mui/joy/Table";
import { Box, Typography } from "@mui/joy";
import InputAutocomplete from "@/components/InputAutocomplete";
import { getAllPlayers } from "@/api/player";
import { useSnackbar } from "@/context/SnackbarContext";

export async function loader({ params }) {
  const { results: allPlayers } = await getAllPlayers();

  return { allPlayers };
}

const WinRateAgainstPlayer = () => {
  const { triggerSnackbar } = useSnackbar();

  const { allPlayers } = useLoaderData();

  const [spotlightPlayer, setSpotlightPlayer] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  console.log(spotlightPlayer);
  useEffect(() => {
    const { id: playerId } = spotlightPlayer;

    if (!playerId) {
      setLeaderboard([]);
      return;
    }

    getWinRateAgainstPlayer(playerId).then(({ results: leaderboard }) => {
      setLeaderboard(leaderboard);
    });
  }, [spotlightPlayer]);

  return (
    <Box display="flex" justifyContent={"center"} margin={5}>
      <Box display="flex" flexDirection={"column"} alignContent={"center"}>
        <InputAutocomplete
          players={allPlayers}
          allSelectedPlayers={[]}
          teamId={0}
          onExistingPlayerSelected={(player) => {
            console.log("SETPLAYER", player);
            if (player) setSpotlightPlayer(player);
          }}
          onNewPlayerAdded={(player) => {
            triggerSnackbar({ message: "Pls only pick from current players" });
          }}
        />

        <Typography level="h2" mt={5}>
          Win Rate Against: {spotlightPlayer.name}
        </Typography>
        <Typography level="body-xs" mb={2}>
          These are the win rates of every player when they play against the
          person in the input.
        </Typography>

        <Table
          borderAxis="bothBetween"
          aria-label="basic table"
          stickyHeader
          stripe="odd"
          sx={{ width: 600 }}
        >
          <thead>
            <tr>
              <th>Player</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row, i) => (
              <tr key={`${row.name}-${i}`}>
                <td>{row.player_name}</td>
                <td component="th" scope="row">
                  {row.wins}
                </td>
                <td align="right">{row.losses}</td>
                <td align="right">{row.win_rate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default WinRateAgainstPlayer;
