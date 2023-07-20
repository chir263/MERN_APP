import "./people.css";

import img_avatar from "../../../../media/user.png";
import { follow } from "../../utility/Follow";
import { useState } from "react";

export default function People({ user }) {
  const [x, setX] = useState(false);
  const flag = JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
    .user_name;
  return (
    <div className="sidebarFriend">
      <img className="sidebarFriendImg" src={img_avatar} alt="" />
      <span className="sidebarFriendName" style={{ margin: "2px" }}>
        {user.first_name}
      </span>
      {flag === user.user_name && (
        <span style={{ margin: "2px", float: "right", color: "#6a6a6a" }}>
          You
        </span>
      )}
      {user.follower && flag !== user.user_name && (
        <span style={{ margin: "2px", float: "right", color: "#6a6a6a" }}>
          follower
        </span>
      )}
      {(user.following || x) && flag !== user.user_name && (
        <span style={{ margin: "2px", float: "right", color: "#474747" }}>
          following
        </span>
      )}
      {!user.following && !x && flag !== user.user_name && (
        <button
          className="follow_button"
          onClick={() => follow(user.user_name, setX)}
        >
          Follow
        </button>
      )}
    </div>
  );
}
