import { Box } from "@mui/joy";

const GameActivityLog = ({ gameActivityLog }) => {
  return (
    <>
      {gameActivityLog.map((e, i) => {
        return (
          <Box key={`log-${i}`}>
            {e.player_name}: {e.act_type}
          </Box>
        );
      })}
    </>
  );
};

export default GameActivityLog;
