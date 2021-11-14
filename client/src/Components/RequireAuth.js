import { useAuth } from "./AuthContext";
import { Navigate } from "react-router";

export function RequireAuth({ children }) {
  let { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
}
