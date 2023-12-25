import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (!isAuthenticated) {
    // user is not authenticated
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
