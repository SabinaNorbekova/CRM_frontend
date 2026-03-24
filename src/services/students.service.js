import api from "./axios";

export const getAllStudents = async () => {
  const res = await api.get("/students/all");
  return res.data;
};

export const getOneStudent = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data;
};

export const createStudent = async (payload) => {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("birth_date", payload.birth_date);

  if (payload.photo) {
    formData.append("photo", payload.photo);
  }

  const res = await api.post("/students", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await api.delete(`/students/${id}`);
  return res.data;
};
