import { Box, Typography } from "@mui/joy";
import { getGameName, getDate } from "../../utils";

const DataEntryHeader = ({ gameData }) => {
  return (
    <Box display="flex" justifyContent="center" gap={10} marginBottom={2}>
      <Typography level="h3" data-testid="dateDisplay">
        Date:{" "}
        <Typography level="body-lg">{getDate(gameData) || "N/A"}</Typography>
      </Typography>
      <Typography level="h3" data-testid="gameNameDisplay">
        Game Name:{" "}
        <Typography level="body-lg">
          {getGameName(gameData) || "N/A"}
        </Typography>
      </Typography>
    </Box>
  );
};

export default DataEntryHeader;
