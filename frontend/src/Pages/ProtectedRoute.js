import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  if (!JSON.parse(localStorage.getItem("greddit_user_loggedin"))) {
    return <Navigate to="/login" />;
  }
  return children;
};
export default ProtectedRoute;
