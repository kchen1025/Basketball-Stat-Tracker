import { Box, Typography, Divider } from "@mui/joy";
import TeamActivityInput from "../../components/TeamActivityInput";
import InputAutocomplete from "@/components/InputAutocomplete";

const TeamSelection = ({
  players,
  teamPlayers,
  allSelectedPlayers,
  teamId,
  gameStats,
  setGameStats,
  gameActivityLog,
  setGameActivityLog,
  gameData,
  onExistingPlayerSelected,
  onNewPlayerAdded,
  header,
}) => {
  return (
    <Box display="flex" flexDirection={"column"} justifyContent="center">
      {header}
      <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
      <InputAutocomplete
        players={players}
        allSelectedPlayers={allSelectedPlayers}
        teamId={teamId}
        onExistingPlayerSelected={onExistingPlayerSelected}
        onNewPlayerAdded={onNewPlayerAdded}
        footerText={`Pick from a list of existing players. Create a new one if doesn't exist.`}
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
