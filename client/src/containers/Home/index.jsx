import { useState, useEffect } from "react";
import Table from "@mui/joy/Table";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box } from "@mui/joy";

import { API } from "@/utils";

const sortGames = (arr) => {
  arr.sort((a, b) => {
    // Extract digits for primary and secondary comparison (assuming the format is always D<number>G<number>)
    const matchA = a.name.match(/D(\d+)G(\d+)/);
    const matchB = b.name.match(/D(\d+)G(\d+)/);

    // Convert matched strings to integers
    const primaryA = parseInt(matchA[1], 10);
    const primaryB = parseInt(matchB[1], 10);
    const secondaryA = parseInt(matchA[2], 10);
    const secondaryB = parseInt(matchB[2], 10);

    // First compare the primary part (D<number>)
    if (primaryA < primaryB) return -1;
    if (primaryA > primaryB) return 1;

    // If primary parts are equal, compare the secondary part (G<number>)
    return secondaryA - secondaryB;
  });

  return arr;
};

const Home = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    API.get("/api/games").then((data) => {
      if (data?.results) {
        const sortedGames = sortGames(data.results);
        console.log(sortedGames);
        setGames(sortedGames);
      }
    });
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (gameId = null) => {
    let data = null;
    if (gameId) {
      data = await API.get(`/api/dashboard?gameId=${gameId}`);
    } else {
      data = await API.get("/api/dashboard");
    }

    console.log(data.results);
    if (data?.results) {
      setDashboardData(data.results);
    }
  };

  const handleChange = (e, newValue) => {
    fetchDashboard(newValue);
  };

  return (
    <>
      <Box margin={5}>
        <Select onChange={handleChange}>
          {games.map((row, i) => {
            return (
              <Option key={`games-${i}`} value={row.name}>
                {row.name}
              </Option>
            );
          })}
        </Select>
        <Table
          borderAxis="bothBetween"
          aria-label="basic table"
          stickyHeader
          stripe="odd"
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }} colSpan={12}>
                TOTAL STATS
              </th>
              <th style={{ textAlign: "center" }} colSpan={10}>
                PER GAME AVERAGES
              </th>
            </tr>
            <tr>
              <th rowSpan={2}>Name</th>
              <th rowSpan={2}>FGM</th>
              <th rowSpan={2}>FGA</th>
              <th rowSpan={2}>3PM</th>
              <th rowSpan={2}>3PA</th>
              <th rowSpan={2}>3P%</th>
              <th rowSpan={2}>REB</th>
              <th rowSpan={2}>AST</th>
              <th rowSpan={2}>STL</th>
              <th rowSpan={2}>BLK</th>
              <th rowSpan={2}>TO</th>
              <th rowSpan={2}>PTS</th>

              <th rowSpan={2}>FGM</th>
              <th rowSpan={2}>FGA</th>
              <th rowSpan={2}>3PM</th>
              <th rowSpan={2}>3PA</th>
              <th rowSpan={2}>REB</th>
              <th rowSpan={2}>AST</th>
              <th rowSpan={2}>STL</th>
              <th rowSpan={2}>BLK</th>
              <th rowSpan={2}>TO</th>
              <th rowSpan={2}>PTS</th>
            </tr>
          </thead>

          <tbody>
            {dashboardData.map((row, i) => (
              <tr
                key={`${row.name}-${i}`}
                // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <td>{row.player_name}</td>
                <td component="th" scope="row">
                  {row.field_goals_made}
                </td>
                <td align="right">{row.field_goals_attempted}</td>
                <td align="right">{row.three_points_made}</td>
                <td align="right">{row.three_points_attempted}</td>
                <td align="right">{row.three_pt_percentage}</td>

                <td align="right">{row.rebounds}</td>
                <td align="right">{row.assists}</td>
                <td align="right">{row.steals}</td>
                <td align="right">{row.blocks}</td>
                <td align="right">{row.turnovers}</td>
                <td align="right">{row.points}</td>

                <td align="right">{row.avg_fgm_per_game}</td>
                <td align="right">{row.avg_fga_per_game}</td>
                <td align="right">{row.avg_three_pm_per_game}</td>
                <td align="right">{row.avg_three_pa_per_game}</td>
                <td align="right">{row.avg_reb_per_game}</td>
                <td align="right">{row.avg_ast_per_game}</td>
                <td align="right">{row.avg_stl_per_game}</td>
                <td align="right">{row.avg_blk_per_game}</td>
                <td align="right">{row.avg_to_per_game}</td>
                <td align="right">{row.avg_pts_per_game}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </>
  );
};

export default Home;
