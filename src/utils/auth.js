import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const removeToken = () => {
  localStorage.removeItem("accessToken");
};

export const getUserFromToken = () => {
  const token = getToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch {
    return null;
  }
};

export const isAdminRole = (role) => {
  return ["SUPERADMIN", "ADMIN", "MANAGEMENT", "ADMINSTRATOR"].includes(role);
};
