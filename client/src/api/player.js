import { API } from "@/utils";

export const getAllPlayers = async () => {
  return await API.get(`/api/players`);
};
