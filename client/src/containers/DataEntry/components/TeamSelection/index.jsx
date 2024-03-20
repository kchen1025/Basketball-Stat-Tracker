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
        teamPlayers={teamPlayers}
        allSelectedPlayers={allSelectedPlayers}
        teamId={teamId}
        onExistingPlayerSelected={onExistingPlayerSelected}
        onNewPlayerAdded={onNewPlayerAdded}
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
