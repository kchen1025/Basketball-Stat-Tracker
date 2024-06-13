import { getChartStatsByPlayer, getAllPlayers } from "@/api/player";
import InputAutocomplete from "@/components/InputAutocomplete";
import { useState, useEffect } from "react";
import { Box, Typography, Divider, Select, Option } from "@mui/joy";
import { Bar } from "@nivo/bar";
import { Sheet } from "@mui/joy";
import { useLoaderData } from "react-router-dom";
import { STATS } from "@/constants";

export async function loader({ params }) {
  const { results: allPlayers } = await getAllPlayers();

  return { allPlayers };
}

const PlayerDashboard = () => {
  const { allPlayers } = useLoaderData();
  const [spotlightPlayer, setSpotlightPlayer] = useState({});
  const [selectedStat, setSelectedStat] = useState("");
  const [chartData, setChartData] = useState({ data: [], keys: [] });

  useEffect(() => {
    const { id: playerId } = spotlightPlayer;

    if (!playerId) {
      return;
    }

    getChartStatsByPlayer(playerId, selectedStat).then(({ data, keys }) => {
      setChartData({ ...chartData, data, keys });
    });
  }, [spotlightPlayer, selectedStat]);

  const handleStatChange = (e, statName) => {
    setSelectedStat(statName);
  };

  // push points into the stats objects because it doesn't matter anyways, just for a better user experience
  STATS["points"] = "points";

  return (
    <Sheet sx={{ overflowX: "auto" }}>
      <Box display="flex" flexDirection={"column"} alignItems={"center"}>
        <Typography level="h2" mt={2}>
          Player Dashboard
        </Typography>
        <Typography level="body-xs" mb={2}>
          Pick a player. Analyze stats over all games. Currently Analyzing{" "}
          {spotlightPlayer.name}
        </Typography>
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
        <Select
          placeholder="Select a stat. Defaults to POINTS"
          onChange={handleStatChange}
        >
          {Object.keys(STATS).map((key, i) => {
            return (
              <Option key={`${STATS[key]}-${i}`} value={STATS[key]}>
                {STATS[key]}
              </Option>
            );
          })}
        </Select>
        <Box mb={2}></Box>
      </Box>
      <Sheet sx={{ backgroundColor: "white", minWidth: 1700 }}>
        <Bar
          width={1700}
          height={500}
          margin={{ top: 60, right: 110, bottom: 60, left: 80 }}
          data={chartData?.data}
          indexBy={"day"}
          keys={chartData?.keys}
          padding={0.2}
          labelTextColor={"inherit:darker(1.4)"}
          labelSkipWidth={16}
          labelSkipHeight={16}
          groupMode="grouped"
        />
      </Sheet>
    </Sheet>
  );
};

export default PlayerDashboard;
