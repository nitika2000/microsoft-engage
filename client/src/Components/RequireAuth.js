import { useAuth } from "./AuthContext";
import { Navigate } from "react-router";

export function RequireAuth({ children, pathType }) {
  let { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (currentUser && (pathType === "signUp" || pathType === "login")) {
    return <Navigate to="/" />;
  }
  return children;
}
