import { API } from "@/utils";

export const getGame = async (gameId) => {
  return await API.get(`/api/game/${gameId}`);
};

export const deleteGame = async (gameId) => {
  return await API.delete(`/api/game/${gameId}`);
};

export const getGameMetaData = async (gameId) => {
  return await API.get(`/api/game-meta-data/${gameId}`);
};

export const getGameLog = async (gameId) => {
  return await API.get(`/api/game-log/${gameId}`);
};
