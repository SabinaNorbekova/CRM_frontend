import api from "./axios";

export const getAllRooms = async () => {
  const res = await api.get("/rooms/all");
  return res.data;
};

export const createRoom = async (payload) => {
  const res = await api.post("/rooms", payload);
  return res.data;
};
