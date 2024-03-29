import { useState, useEffect } from "react";
import Table from "@mui/joy/Table";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, Button, Sheet } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils";
import { useSnackbar } from "@/context/SnackbarContext";
import { deleteGame, getAllGames } from "@/api/game";
import { getDaysFromGames, isTotalGameStats } from "./utils";
import EnhancedTableHead from "./components/EnhancedTableHead";
import DateRangePicker from "./components/DateRangePicker";
import { getComparator, sortDayGameComparator } from "@/utils/sortUtils";

const isDaySelected = (selectedDay) => {
  return selectedDay !== "";
};

const isGameSelected = (selectedGame) => {
  // check if selected game is not an empty object
  return Object.keys(selectedGame)?.length !== 0;
};

const sortedGames = (arr) => {
  arr.sort(sortDayGameComparator);
  return arr;
};

const fetchSortedGames = async (setGames) => {
  const { results } = await getAllGames();
  setGames(sortedGames(results));
};

const Home = () => {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("player_name");

  const [dashboardData, setDashboardData] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const { triggerSnackbar } = useSnackbar();

  const navigate = useNavigate();

  useEffect(() => {
    fetchSortedGames(setGames);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const fetchDashboardByDates = async (startDate, endDate) => {
    const data = await API.get(
      `/api/dashboard?startDate=${startDate}&endDate=${endDate}`
    );

    if (data?.results) {
      setDashboardData(data.results);
    }
  };

  const handleDateSubmit = async (dates) => {
    const { startDate, endDate } = dates;
    fetchDashboardByDates(startDate, endDate);
  };

  const handleChange = (e, gameName) => {
    const currentGame = games.filter((e) => e.name === gameName);
    setSelectedGame({ ...currentGame[0] });
    fetchDashboard(gameName);
  };

  const handleDayChange = (e, dayName) => {
    setSelectedDay(dayName);
    // since we are just doing a database LIKE search, this works equally well
    fetchDashboard(`${dayName}G`);
  };

  const handleEditGame = () => {
    const currentGameId = selectedGame?.id;

    if (!currentGameId) {
      triggerSnackbar({ message: "No game is selected to edit" });
      return;
    }
    navigate(`/data-entry/${currentGameId}`);
  };

  const handleDeleteGame = async () => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        const currentGameId = selectedGame?.id;
        const { results: deletedGames } = await deleteGame(currentGameId);

        // fetch dashboard to reset data to homepage
        await fetchDashboard();

        // reset selected game
        setSelectedGame({});

        // delete from games the id
        const filteredGames = games.filter((e) => e.id !== deletedGames[0]);
        setGames([...filteredGames]);

        triggerSnackbar({
          message: `Successfully deleted game ${currentGameId}`,
          color: "success",
        });
      } catch (err) {
        triggerSnackbar({ message: "Unable to delete game" });
      }
    }
  };

  const alwaysShowColumns = [
    { key: "player_name", label: "Name", rowSpan: 2, align: "left" },
    { key: "wins", label: "Wins", rowSpan: 2, align: "right" },
    { key: "games_played", label: "GP", rowSpan: 2, align: "right" },
    {
      key: "win_percentage",
      label: "W%",
      rowSpan: 2,
      align: "right",
    },
    { key: "field_goals_made", label: "FGM", rowSpan: 2, align: "right" },
    { key: "field_goals_attempted", label: "FGA", rowSpan: 2, align: "right" },
    { key: "fg_percentage", label: "FG%", rowSpan: 2, align: "right" },
    { key: "three_points_made", label: "3PM", rowSpan: 2, align: "right" },
    { key: "three_points_attempted", label: "3PA", rowSpan: 2, align: "right" },
    { key: "three_pt_percentage", label: "3P%", rowSpan: 2, align: "right" },
    { key: "rebounds", label: "REB", rowSpan: 2, align: "right" },
    { key: "assists", label: "AST", rowSpan: 2, align: "right" },
    { key: "steals", label: "STL", rowSpan: 2, align: "right" },
    { key: "blocks", label: "BLK", rowSpan: 2, align: "right" },
    { key: "turnovers", label: "TO", rowSpan: 2, align: "right" },
    { key: "points", label: "PTS", rowSpan: 2, align: "right" },
    {
      key: "true_shooting_percentage",
      label: "TS%",
      rowSpan: 2,
      align: "right",
    },
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

  const gameDays = getDaysFromGames(games);

  return (
    <>
      <Sheet sx={{ overflowX: "auto" }}>
        <Box margin={3}>
          {isTotalGameStats(selectedGame) ? (
            <DateRangePicker onSubmit={handleDateSubmit} />
          ) : null}
          {isDaySelected(selectedDay) ? null : (
            <Select placeholder="Select a game" onChange={handleChange}>
              {games.map((row, i) => {
                return (
                  <Option key={`games-${i}`} value={row.name}>
                    {row.name}
                  </Option>
                );
              })}
            </Select>
          )}
          {isGameSelected(selectedGame) ? null : (
            <Select placeholder="Select a day" onChange={handleDayChange}>
              {gameDays.map((day, i) => {
                return (
                  <Option key={`days-${i}`} value={day}>
                    {day}
                  </Option>
                );
              })}
            </Select>
          )}
          {!isTotalGameStats(selectedGame) ? (
            <>
              <Button onClick={handleEditGame} color="neutral">
                Edit Game
              </Button>
              <Button onClick={handleDeleteGame} color="danger">
                Delete Game
              </Button>
            </>
          ) : null}
          <Table
            borderAxis="bothBetween"
            aria-label="basic table"
            stickyHeader
            stripe="odd"
            hoverRow
            sx={{ minWidth: 1600 }}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columnsToShow={columnsToShow}
              selectedGame={selectedGame}
            />

            <tbody>
              {dashboardData
                .sort(getComparator(order, orderBy))
                .map((row, i) => (
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
      </Sheet>
    </>
  );
};

export default Home;
