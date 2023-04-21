import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("greddit_user_loggedin");
    localStorage.removeItem("greddit_opened_subs");
    navigate("/login");
  };
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="logo">Greddiit</span>
      </div>
      <div className="topbarCenter"></div>
      <div className="topbarRight">
        <div className="topbarLinks" style={{ margin: "0" }}>
          <span style={{ fontSize: "20px", marginRight: "20px" }}>
            {
              JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                .user_name
            }
          </span>
          <Link to="/dashboard/profile" style={{ textDecoration: "none" }}>
            <span className="topbarLink">Profile</span>
          </Link>
          <span className="topbarLink" onClick={logout}>
            Logout
          </span>
          {/* <span className="topbarLink">Timeline</span> */}
        </div>
      </div>
    </div>
  );
}
