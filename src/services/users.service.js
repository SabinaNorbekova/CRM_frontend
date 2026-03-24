import api from "./axios";

export const createUser = async (payload) => {
  const formData = new FormData();

  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("position", payload.position);
  formData.append("hire_date", payload.hire_date);
  formData.append("role", payload.role);

  if (payload.address) {
    formData.append("address", payload.address);
  }

  if (payload.photo) {
    formData.append("photo", payload.photo);
  }

  const res = await api.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
