import { API } from "@/utils";

export const createActLog = async ({
  playerId: player_id,
  actType: act_type,
  date,
  gameId: game_id,
  teamId: team_id,
}) => {
  return await API.post("/api/act", {
    player_id,
    act_type,
    date,
    game_id,
    team_id,
  });
};
