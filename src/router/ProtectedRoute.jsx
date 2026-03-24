import { Navigate } from "react-router-dom";
import { getToken, getUserFromToken, removeToken } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const token = getToken();
  const user = getUserFromToken();

  if (!token || !user) {
    removeToken();
    return <Navigate to="/" replace />;
  }

  return children;
}
