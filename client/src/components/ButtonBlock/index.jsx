import { Box, Button } from "@mui/joy";
import { STATS } from "@/constants";
import { createActLog } from "@/api/act";

const ButtonBlock = ({
  name,
  playerId,
  teamId,
  gameStats,
  setGameStats,
  gameLogData,
  setGameLogData,
  date,
  gameId,
}) => {
  const handleStatChange = (statChange) => async () => {
    const updatedStats = gameStats.map((e) => {
      if (e.player_id === playerId) {
        const update = { ...e };
        switch (statChange) {
          case STATS.twoPtMiss:
            update.fga++;
            break;
          case STATS.twoPtMake:
            update.fga++;
            update.fgm++;
            break;
          case STATS.threePtMiss:
            update.tpa++;
            update.fga++;
            break;
          case STATS.threePtMake:
            update.fga++;
            update.fgm++;
            update.tpa++;
            update.tpm++;
            break;
          case STATS.rebound:
            update.rebounds++;
            break;
          case STATS.assist:
            update.assists++;
            break;
          case STATS.steal:
            update.steals++;
            break;
          case STATS.block:
            update.blocks++;
            break;
          case STATS.turnover:
            update.turnovers++;
            break;
          default:
            break;
        }
        return update;
      }
      return e;
    });

    setGameStats(updatedStats);
    const newGameLogData = [...gameLogData];
    newGameLogData.unshift({
      player_id: playerId,
      player_name: name,
      act_type: statChange,
    });
    console.log({
      playerId,
      actType: statChange,
      date,
      gameId,
      teamId,
    });
    await createActLog({
      playerId,
      actType: statChange,
      date,
      gameId,
      teamId,
    });
    setGameLogData([...newGameLogData]);
  };

  const disabled = !teamId || teamId === -1;

  return (
    <Box display="flex" alignItems={"center"} margin={1} gap={1}>
      <div>{name}</div>
      <Box display="flex" gap={1}>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.twoPtMiss)}
        >
          2Pt Miss
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.twoPtMake)}
        >
          2Pt Make
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.threePtMiss)}
        >
          3Pt Miss
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.threePtMake)}
        >
          3Pt Make
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.rebound)}
        >
          REB
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.assist)}
        >
          AST
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.steal)}
        >
          STL
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.block)}
        >
          BLK
        </Button>
        <Button
          size="sm"
          disabled={disabled}
          onClick={handleStatChange(STATS.turnover)}
        >
          TO
        </Button>
      </Box>
    </Box>
  );
};

export default ButtonBlock;
