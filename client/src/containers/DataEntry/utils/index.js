import {
  setBothTeamPlayers,
  composeTeams,
  getWinner,
  isWinnerInTeams,
  areTeamsAvailable,
  isEitherTeamEmpty,
} from "./team";

import { format } from "date-fns";

const getDate = (gameData) => {
  if (gameData && gameData.length) {
    const date = gameData[0]?.date;
    return date ? format(date, "yyyy-M-d") : null;
  }
  return null;
};

const getGameName = (gameData) => {
  if (gameData && gameData.length) {
    return gameData[0]?.name;
  }
  return null;
};

const getGameId = (gameData) => {
  if (gameData && gameData.length) {
    return gameData[0]?.id;
  }
  return null;
};

export {
  getDate,
  getGameName,
  getGameId,
  setBothTeamPlayers,
  composeTeams,
  getWinner,
  isWinnerInTeams,
  areTeamsAvailable,
  isEitherTeamEmpty,
};
