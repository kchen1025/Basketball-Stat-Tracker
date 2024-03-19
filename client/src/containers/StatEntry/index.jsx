import React, { useState } from "react";

import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import { FormLabel, FormControl, Grid, Divider, Table } from "@mui/joy";

import { STATS } from "@/constants";

const StatEntry = () => {
  const [stats, setStats] = useState([]);
  const [statChangeHistory, setStatChangeHistory] = useState([]);
  const [playerName, setPlayerName] = useState("");

  const handleAddPlayer = (playerName) => {
    setStats([
      ...stats,
      {
        name: playerName,
        FGM: 0,
        FGA: 0,
        TPM: 0,
        TPA: 0,
        REB: 0,
        AST: 0,
        STL: 0,
        BLK: 0,
        TO: 0,
      },
    ]);
  };

  const handleStatChange = (name, statChange) => () => {
    const updatedStats = stats.map((player) => {
      if (player.name === name) {
        const update = { ...player };
        switch (statChange) {
          case STATS.twoPtMiss:
            update.FGA++;
            break;
          case STATS.twoPtMake:
            update.FGA++;
            update.FGM++;
            break;
          case STATS.threePtMiss:
            update.TPA++;
            update.FGA++;
            break;
          case STATS.threePtMake:
            update.FGA++;
            update.FGM++;
            update.TPA++;
            update.TPM++;
            break;
          case STATS.rebound:
            update.REB++;
            break;
          case STATS.assist:
            update.AST++;
            break;
          case STATS.steal:
            update.STL++;
            break;
          case STATS.block:
            update.BLK++;
            break;
          case STATS.turnover:
            update.TO++;
            break;
          default:
            break;
        }
        return update;
      }
      return player;
    });

    setStats(updatedStats);
    setStatChangeHistory([...statChangeHistory, { name, statChange }]);
  };

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to reset all stats?")) {
      const resetStats = stats.map((player) => ({
        ...player,
        FGM: 0,
        FGA: 0,
        TPM: 0,
        TPA: 0,
        REB: 0,
        AST: 0,
        STL: 0,
        BLK: 0,
        TO: 0,
      }));
      setStats(resetStats);
      setStatChangeHistory([]);
    }
  };

  const handleStatUndo = () => {
    if (statChangeHistory.length === 0) return;

    const lastChange = statChangeHistory[statChangeHistory.length - 1];
    const updatedStats = stats.map((player) => {
      if (player.name === lastChange.name) {
        const update = { ...player };
        // Reverse the stat change based on lastChange.statChange
        // Similar switch-case as in handleStatChange but decrementing
        return update;
      }
      return player;
    });

    setStats(updatedStats);
    setStatChangeHistory(statChangeHistory.slice(0, -1));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddPlayer(playerName);
    setPlayerName("");
  };

  const renderStatChangeHistory = () => {
    const output = [];
    for (let i = statChangeHistory.length - 1; i >= 0; i--) {
      const change = statChangeHistory[i];
      output.push(
        <div key={`${change.name}-${change.statChange}-${i}`}>
          {i + 1}. {change.name}: {change.statChange}
        </div>
      );
    }
    return output;
  };

  return (
    <Grid container justifyContent="center" margin={5}>
      <Box margin={3} width={500}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Box display="flex" justifyContent={"center"} alignItems={"flex-end"}>
            <FormControl>
              <FormLabel>Add Player</FormLabel>
              <Input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Enter player name"
                required
              />
            </FormControl>
            <Button type="submit" variant="solid">
              Add Player
            </Button>
          </Box>
        </form>
      </Box>

      <Box margin={3}>
        <Divider />
        {stats.map((e) => {
          return (
            <>
              <Box display="flex" alignItems={"center"} margin={1} gap={1}>
                <div>{e.name}</div>
                <Box display="flex" gap={1}>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.twoPtMiss)}
                  >
                    2Pt Miss
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.twoPtMake)}
                  >
                    2Pt Make
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.threePtMiss)}
                  >
                    3Pt Miss
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.threePtMake)}
                  >
                    3Pt Make
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.rebound)}
                  >
                    REB
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.assist)}
                  >
                    AST
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.steal)}
                  >
                    STL
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.block)}
                  >
                    BLK
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleStatChange(e.name, STATS.turnover)}
                  >
                    TO
                  </Button>
                </Box>
              </Box>
            </>
          );
        })}
      </Box>

      <Box margin={3}>
        <Divider />
        <Table borderAxis="bothBetween" aria-label="basic table">
          <thead>
            <tr>
              <th rowSpan={2}>Player</th>
              <th rowSpan={2}>FGM</th>
              <th rowSpan={2}>FGA</th>
              <th rowSpan={2}>FG%</th>
              <th rowSpan={2}>3PM</th>
              <th rowSpan={2}>3PA</th>
              <th rowSpan={2}>3P%</th>
              <th rowSpan={2}>REB</th>
              <th rowSpan={2}>AST</th>
              <th rowSpan={2}>STL</th>
              <th rowSpan={2}>BLK</th>
              <th rowSpan={2}>TO</th>
              <th rowSpan={2}>PTS</th>
              <th rowSpan={2}>TS%</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((player) => {
              return (
                <tr>
                  <td>{player.name}</td>
                  <td>{player.FGM}</td>
                  <td>{player.FGA}</td>
                  <td>
                    {Math.round((player.FGM * 10000) / player.FGA) / 100}%
                  </td>
                  <td>{player.TPM}</td>
                  <td>{player.TPA}</td>
                  <td>{Math.round((player.TPM * 10000) / player.TPA) / 100}</td>
                  <td>{player.REB}</td>
                  <td>{player.AST}</td>
                  <td>{player.STL}</td>
                  <td>{player.BLK}</td>
                  <td>{player.TO}</td>
                  <td>{player.FGM * 2 + player.TPM}</td>
                  <td>
                    {Math.round(
                      ((player.FGM * 2 + player.TPM) * 10000) / (2 * player.FGA)
                    ) / 100}
                    %
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Box display="flex" justifyContent={"center"}>
          <Button onClick={handleResetStats}>Reset Stats</Button>
        </Box>
      </Box>

      <Divider />
      <Box margin={3} borderTop={"1px solid gray"}>
        {renderStatChangeHistory()}
        <Box display="flex" justifyContent={"center"}>
          <Button onClick={handleStatUndo}>Undo</Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default StatEntry;
