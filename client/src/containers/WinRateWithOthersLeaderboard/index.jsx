import { getPlayerWithPlayerLeaderboard } from "@/api/leaderboard";
import { useLoaderData } from "react-router-dom";

import DataTable from "@/components/DataTable";

export async function loader({ params }) {
  const { results: leaderboard } = await getPlayerWithPlayerLeaderboard();
  return { leaderboard };
}

const WinRateWithOthersLeaderboard = () => {
  const { leaderboard } = useLoaderData();

  return (
    <DataTable
      headerText={"Win Rate With Player Leaderboard"}
      subHeaderText={
        "This is the win rate when players are paired up on the same team. Each row is unique."
      }
      defaultSortKey={"win_rate"}
      defaultSortDirection={"asc"}
      headerColumns={[
        { key: "player1_name", label: "Player 1", rowSpan: 2, align: "left" },
        {
          key: "player2_name",
          label: "Player 2",
          rowSpan: 2,
          align: "left",
        },
        {
          key: "total_wins",
          label: "Wins",
          rowSpan: 2,
          align: "right",
        },
        { key: "total_losses", label: "Losses", rowSpan: 2, align: "right" },
        {
          key: "win_rate",
          label: "Win Rate",
          rowSpan: 2,
          align: "right",
        },
      ]}
      data={leaderboard}
      maxWidth={800}
    />
  );
};

export default WinRateWithOthersLeaderboard;
