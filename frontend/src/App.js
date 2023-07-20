import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./Pages/Error";
import Dashboard from "./Pages/dashboard/pages/dashboard/Dashboard";
import ProtectedRoute from "./Pages/ProtectedRoute";
import ProtectedSignLogin from "./Pages/ProtectedSignLogin";
import Home from "./Pages/Home";
import fav_icon from "../src/media/login/fav_icon.png";

function App() {
  document.title = "Greddit";
  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = fav_icon;
  console.log("started");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard/:page_val?"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:page_val?/:ops?"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="login"
          element={
            <ProtectedSignLogin>
              <Home />
            </ProtectedSignLogin>
          }
        />
        <Route path="*" element={<Error text="404 Page Not Found" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
