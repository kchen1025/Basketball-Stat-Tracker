import { API } from "@/utils";

export const createGame = async (params) => {
  const { date, gameName } = params;
  return await API.post("/api/create-game", { date, gameName });
};
