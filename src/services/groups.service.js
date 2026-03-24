import api from "./axios";

export const getAllGroups = async () => {
  const res = await api.get("/groups/all");
  return res.data;
};

export const createGroup = async (payload) => {
  const res = await api.post("/groups", payload);
  return res.data;
};

export const getGroupLessons = async (groupId) => {
  const res = await api.get(`/groups/${groupId}/lessons`);
  return res.data;
};
