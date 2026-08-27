import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const createRoom = async (payload) => {
  const response = await api.post(ENDPOINTS.CREATE_ROOM, payload);
  return response.data;
};

export const getAllRooms = async () => {
  const response = await api.get(ENDPOINTS.GET_ALL_ROOMS);
  return response.data;
};
