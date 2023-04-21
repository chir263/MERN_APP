import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  if (JSON.parse(localStorage.getItem("greddit_user_loggedin"))) {
    return <Navigate to="/dashboard/profile" />;
  }
  return children;
};
export default ProtectedRoute;
