import api from "./axios";

export const getAllCourses = async () => {
  const res = await api.get("/course/all");
  return res.data;
};

export const createCourse = async (payload) => {
  const res = await api.post("/course", payload);
  return res.data;
};
