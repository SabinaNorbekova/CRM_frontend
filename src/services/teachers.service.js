import api from "./axios";

export const getAllTeachers = async () => {
  const res = await api.get("/teachers/all");
  return res.data;
};

export const getOneTeacher = async (id) => {
  const res = await api.get(`/teachers/${id}`);
  return res.data;
};

export const createTeacher = async (payload) => {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("position", payload.position);
  formData.append("experience", String(payload.experience));

  if (payload.photo) {
    formData.append("photo", payload.photo);
  }

  const res = await api.post("/teachers", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateTeacher = async (id, payload) => {
  const res = await api.put(`/teachers/${id}`, {
    fullName: payload.fullName,
    email: payload.email,
    position: payload.position,
    experience: Number(payload.experience),
    ...(payload.password ? { password: payload.password } : {}),
  });

  return res.data;
};

export const deleteTeacher = async (id) => {
  const res = await api.delete(`/teachers/${id}`);
  return res.data;
};
