import { API } from "@/utils";

export const getAllPlayers = async () => {
  return await API.get(`/api/players`);
};

export const createPlayer = async ({ playerName: player_name }) => {
  return await API.post(`/api/player`, { player_name });
};

export const getCareerHighs = async () => {
  return await API.get(`/api/players/career-highs`);
};
