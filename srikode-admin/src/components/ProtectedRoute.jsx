import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

/**
 * Route protection wrapper component.
 * Redirects unauthenticated users to the Login page.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
