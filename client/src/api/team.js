import { API } from "@/utils";

export const createTeam = async (playerIds, gameId, teamNum) => {
  return await API.post("/api/team", { playerIds, gameId, teamNum });
};

export const createTeams = async ({
  team1PlayerIds: team1_player_ids,
  team2PlayerIds: team2_player_ids,
  gameId: game_id,
}) => {
  return await API.post("/api/teams", {
    team1_player_ids,
    team2_player_ids,
    game_id,
  });
};
