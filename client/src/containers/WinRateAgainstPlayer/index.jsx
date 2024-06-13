import { getWinRateAgainstPlayer } from "@/api/leaderboard";
import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/joy";
import InputAutocomplete from "@/components/InputAutocomplete";
import { getAllPlayers } from "@/api/player";
import { useSnackbar } from "@/context/SnackbarContext";
import DataTable from "@/components/DataTable";

export async function loader({ params }) {
  const { results: allPlayers } = await getAllPlayers();

  return { allPlayers };
}

const WinRateAgainstPlayer = () => {
  const { triggerSnackbar } = useSnackbar();

  const { allPlayers } = useLoaderData();

  const [spotlightPlayer, setSpotlightPlayer] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

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
          headerText="Select a player to analyze"
          players={allPlayers}
          allSelectedPlayers={[]}
          teamId={0}
          onExistingPlayerSelected={(player) => {
            if (player) setSpotlightPlayer(player);
          }}
          onNewPlayerAdded={(player) => {
            triggerSnackbar({ message: "Pls only pick from current players" });
          }}
        />

        <DataTable
          headerText={`Win Rate Against: ${spotlightPlayer.name}`}
          subHeaderText={`These are the win rates of every player when they play against the person in the input.`}
          defaultSortKey={"win_rate"}
          defaultSortDirection={"asc"}
          headerColumns={[
            {
              key: "player_name",
              label: "Player",
              rowSpan: 2,
              align: "left",
            },
            {
              key: "wins",
              label: "Wins",
              rowSpan: 2,
              align: "right",
            },
            { key: "losses", label: "Losses", rowSpan: 2, align: "right" },
            {
              key: "win_rate",
              label: "Win Rate %",
              rowSpan: 2,
              align: "right",
            },
          ]}
          data={leaderboard}
          maxWidth={800}
        />
      </Box>
    </Box>
  );
};

export default WinRateAgainstPlayer;
