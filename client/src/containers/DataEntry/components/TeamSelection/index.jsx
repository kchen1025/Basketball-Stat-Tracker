import { Box, Typography, Divider } from "@mui/joy";
import TeamActivityInput from "../../components/TeamActivityInput";
import InputAutocomplete from "@/components/InputAutocomplete";

const TeamSelection = ({
  players,
  teamPlayers,
  teamId,
  gameStats,
  setGameStats,
  gameActivityLog,
  setGameActivityLog,
  gameData,
  onExistingPlayerSelected,
}) => {
  return (
    <Box display="flex" flexDirection={"column"} justifyContent="center">
      <Typography level="h2">Team 1</Typography>
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <InputAutocomplete
        players={players}
        onExistingPlayerSelected={onExistingPlayerSelected}
      />
      <TeamActivityInput
        gameStats={gameStats}
        setGameStats={setGameStats}
        gameActivityLog={gameActivityLog}
        setGameActivityLog={setGameActivityLog}
        gameData={gameData}
        teamPlayers={teamPlayers}
        teamId={teamId}
      />
    </Box>
  );
};

export default TeamSelection;
