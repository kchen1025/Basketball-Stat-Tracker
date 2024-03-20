import { API } from "@/utils";

export const getPlayerWithPlayerLeaderboard = async () => {
  return await API.get(`/api/win-rate-with-player`);
};

export const getWinRateAgainstPlayer = async (playerId) => {
  return await API.get(`/api/win-rate-against-player/${playerId}`);
};
