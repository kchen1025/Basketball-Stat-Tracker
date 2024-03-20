import { getPlayerWithPlayerLeaderboard } from "@/api/leaderboard";
import { useLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import Table from "@mui/joy/Table";
import { Box } from "@mui/joy";

export async function loader({ params }) {
  const { results: leaderboard } = await getPlayerWithPlayerLeaderboard();
  return { leaderboard };
}

const WinRateWithOthersLeaderboard = () => {
  const { leaderboard } = useLoaderData();

  return (
    <Box display="flex" justifyContent={"center"} margin={5}>
      <Table
        borderAxis="bothBetween"
        aria-label="basic table"
        stickyHeader
        stripe="odd"
        sx={{ width: 600 }}
      >
        <thead>
          <tr>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Total Losses</th>
            <th>Total Wins</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((row, i) => (
            <tr key={`${row.name}-${i}`}>
              <td>{row.player1_name}</td>
              <td component="th" scope="row">
                {row.player2_name}
              </td>
              <td align="right">{row.total_losses}</td>
              <td align="right">{row.total_wins}</td>
              <td align="right">{row.win_rate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default WinRateWithOthersLeaderboard;
