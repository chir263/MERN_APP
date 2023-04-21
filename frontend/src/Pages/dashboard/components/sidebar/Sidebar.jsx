import "./sidebar.css";
import { Chat, Group } from "@mui/icons-material";
import RedditIcon from "@mui/icons-material/Reddit";
import PostAddIcon from "@mui/icons-material/PostAddOutlined";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CloseFriend from "../closeFriend/CloseFriend";
import { useEffect, useState } from "react";
import { API_URL } from "../../../../API_URL";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = React.memo(() => {
  const nav = useNavigate();
  const [userlist, setUserList] = useState([]);
  const [usernum, setUserNum] = useState(1);
  const [showUser, setShowUser] = useState(false);
  const fetchUsers = () => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .get(API_URL + `/user/?page=${usernum}`, { headers })
      .then((resp) => {
        setUserList([...userlist, ...resp.data.allUsers]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [usernum]);
  const [subpages, setSub] = useState(
    JSON.parse(localStorage.getItem("greddit_opened_subs")).opened
  );
  const removePage = (page) => {
    setSub(subpages.filter((page_) => page_ !== page));
    let ar = JSON.parse(localStorage.getItem("greddit_opened_subs")).opened;
    ar = ar.filter((page_) => page_ !== page);
    localStorage.setItem("greddit_opened_subs", JSON.stringify({ opened: ar }));
  };
  // console.log(subpages);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          {subpages.map((page) => {
            return (
              <li className="sidebarListItemSpage" key={Math.random()}>
                <RedditIcon className="sidebarIcon" />
                <button
                  className="follow_button"
                  onClick={() => removePage(page)}
                >
                  Close
                </button>
                <span
                  className="sidebarListItemText"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    nav("/dashboard/subgreddit_" + page);
                  }}
                >
                  g/{page}
                </span>
              </li>
            );
          })}

          <li className="sidebarListItem">
            <PostAddIcon className="sidebarIcon" />
            <Link
              to="/dashboard/saved_posts"
              style={{ textDecoration: "none", color: "black" }}
            >
              <span className="sidebarListItemText">Posts</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <Link
              to="/dashboard/chats"
              style={{ textDecoration: "none", color: "black" }}
            >
              <span
                className="sidebarListItemText"
                style={{ cursor: "pointer" }}
              >
                Chats
              </span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <RedditIcon className="sidebarIcon" />
            <Link
              to="/dashboard/my_subgreddit"
              style={{ textDecoration: "none", color: "black" }}
            >
              <span
                className="sidebarListItemText"
                style={{ cursor: "pointer" }}
              >
                My SubGreddits
              </span>
            </Link>
          </li>
          <li
            className="sidebarListItem"
            // onClick={() => {
            //   // fetchUsers();
            //   // setUserNum(1);
            //   setHomePage("subgreddit");
            // }}
          >
            <RedditIcon className="sidebarIcon" />
            <Link
              to="/dashboard/subgreddits"
              style={{ textDecoration: "none", color: "black" }}
            >
              <span className="sidebarListItemText">Subgreddits</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <ReportProblemIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Reports</span>
          </li>
          <li
            className="sidebarListItem"
            onClick={() => {
              // fetchUsers();
              // setUserNum(1);
              // if (!showUser) setRender(!render);

              setShowUser(!showUser);
            }}
          >
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText" style={{ cursor: "pointer" }}>
              People
            </span>
          </li>
        </ul>
        {/* <hr className="sidebarHr" /> */}

        {showUser && userlist && (
          <ul className="sidebarFriendList">
            {userlist.map((u) => (
              <CloseFriend key={Math.random()} user={u} />
            ))}
          </ul>
        )}

        {showUser && userlist && (
          <button
            className="sidebarButton"
            onClick={() => setUserNum(usernum + 1)}
          >
            Show More
          </button>
        )}
        {showUser && userlist && usernum > 1 && (
          <button
            className="sidebarButton"
            onClick={() => {
              setUserList([]);
              setUserNum(1);
            }}
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
});

export default Sidebar;
