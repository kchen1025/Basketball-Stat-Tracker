import { API } from "@/utils";

export const createTeam = async (playerIds, gameId, teamNum) => {
  return await API.post("/api/team", { playerIds, gameId, teamNum });
};
