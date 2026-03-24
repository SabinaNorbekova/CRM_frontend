import api from "./axios";

export const getStudentsCount = async () => {
  const res = await api.get("/students/all");
  return res.data?.data?.length || 0;
};

export const getGroupsCount = async () => {
  const res = await api.get("/groups/all");
  return res.data?.data?.length || 0;
};

export const getTeachersCount = async () => {
  const res = await api.get("/teachers/all");
  return res.data?.data?.length || 0;
};

export const getDashboardStats = async () => {
  const [students, groups, teachers] = await Promise.all([
    getStudentsCount(),
    getGroupsCount(),
    getTeachersCount(),
  ]);

  return {
    students,
    groups,
    teachers,
  };
};
