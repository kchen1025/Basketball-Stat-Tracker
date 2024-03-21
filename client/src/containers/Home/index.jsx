import { useState, useEffect } from "react";
import Table from "@mui/joy/Table";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils";
import { useSnackbar } from "@/context/SnackbarContext";

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

const isTotalGameStats = (selectedGame) =>
  Object.values(selectedGame).length === 0;

const Home = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState({});
  const { triggerSnackbar } = useSnackbar();

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/games").then((data) => {
      if (data?.results) {
        const sortedGames = sortGames(data.results);
        setGames(sortedGames);
      }
    });
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (gameName = null) => {
    let data = null;
    if (gameName) {
      data = await API.get(`/api/dashboard?gameId=${gameName}`);
    } else {
      data = await API.get("/api/dashboard");
    }

    if (data?.results) {
      setDashboardData(data.results);
    }
  };

  const handleChange = (e, gameName) => {
    const currentGame = games.filter((e) => e.name === gameName);
    setSelectedGame({ ...currentGame[0] });
    fetchDashboard(gameName);
  };

  const handleEditGame = () => {
    const currentGameId = selectedGame?.id;

    if (!currentGameId) {
      triggerSnackbar({ message: "No game is selected to edit" });
      return;
    }
    navigate(`/data-entry/${currentGameId}`);
  };

  const alwaysShowColumns = [
    { key: "player_name", label: "Name", rowSpan: 2, align: "left" },
    { key: "field_goals_made", label: "FGM", rowSpan: 2, align: "right" },
    { key: "field_goals_attempted", label: "FGA", rowSpan: 2, align: "right" },
    { key: "three_points_made", label: "3PM", rowSpan: 2, align: "right" },
    { key: "three_points_attempted", label: "3PA", rowSpan: 2, align: "right" },
    { key: "three_pt_percentage", label: "3P%", rowSpan: 2, align: "right" },
    { key: "rebounds", label: "REB", rowSpan: 2, align: "right" },
    { key: "assists", label: "AST", rowSpan: 2, align: "right" },
    { key: "steals", label: "STL", rowSpan: 2, align: "right" },
    { key: "blocks", label: "BLK", rowSpan: 2, align: "right" },
    { key: "turnovers", label: "TO", rowSpan: 2, align: "right" },
    { key: "points", label: "PTS", rowSpan: 2, align: "right" },
  ];

  const conditionalColumns = [
    { key: "avg_fgm_per_game", label: "FGM", rowSpan: 2, align: "right" },
    { key: "avg_fga_per_game", label: "FGA", rowSpan: 2, align: "right" },
    { key: "avg_three_pm_per_game", label: "3PM", rowSpan: 2, align: "right" },
    { key: "avg_three_pa_per_game", label: "3PA", rowSpan: 2, align: "right" },
    { key: "avg_reb_per_game", label: "REB", rowSpan: 2, align: "right" },
    { key: "avg_ast_per_game", label: "AST", rowSpan: 2, align: "right" },
    { key: "avg_stl_per_game", label: "STL", rowSpan: 2, align: "right" },
    { key: "avg_blk_per_game", label: "BLK", rowSpan: 2, align: "right" },
    { key: "avg_to_per_game", label: "TO", rowSpan: 2, align: "right" },
    { key: "avg_pts_per_game", label: "PTS", rowSpan: 2, align: "right" },
  ];

  const columnsToShow = isTotalGameStats(selectedGame)
    ? [...alwaysShowColumns, ...conditionalColumns]
    : alwaysShowColumns;

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
        {!isTotalGameStats(selectedGame) ? (
          <Button onClick={handleEditGame} color="danger">
            Edit Game
          </Button>
        ) : null}
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
              {isTotalGameStats(selectedGame) ? (
                <>
                  <th style={{ textAlign: "center" }} colSpan={10}>
                    PER GAME AVERAGES
                  </th>
                </>
              ) : null}
            </tr>
            <tr>
              {columnsToShow.map((col) => (
                <th
                  key={col.key}
                  style={{ textAlign: col.align }}
                  colSpan={col.colSpan || 1}
                  rowSpan={col.rowSpan || 1}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {dashboardData.map((row, i) => (
              <tr key={`${row.name}-${i}`}>
                {columnsToShow.map((col) => (
                  <td key={col.key} align={col.align}>
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </>
  );
};

export default Home;
