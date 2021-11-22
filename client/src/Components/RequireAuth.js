import { useAuth } from "./AuthContext";
import { Navigate } from "react-router";

export function RequireAuth({ children, pathType }) {
  let { currentUser } = useAuth();
  if (pathType === "signUp" || pathType === "login") {
    if (currentUser) return <Navigate to="/" />;
    else {
      return children;
    }
  }
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
}
