import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

type ProtectedRouteProps = {
  redirectPath?: string;
};

const ProtectedRoute = ({ redirectPath = "/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading, show a loading indicator
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;
