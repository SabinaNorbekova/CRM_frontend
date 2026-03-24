import { Navigate } from "react-router-dom";
import {
  getToken,
  getUserFromToken,
  isAdminRole,
  removeToken,
} from "../utils/auth";

export default function AdminRoute({ children }) {
  const token = getToken();
  const user = getUserFromToken();

  if (!token || !user) {
    removeToken();
    return <Navigate to="/" replace />;
  }

  if (!isAdminRole(user.role)) {
    removeToken();
    return <Navigate to="/" replace />;
  }

  return children;
}
