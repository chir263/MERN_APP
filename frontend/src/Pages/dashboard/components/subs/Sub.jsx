import "./post.css";
import RedditIcon from "@mui/icons-material/Reddit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { API_URL } from "../../../../API_URL";
import { useState } from "react";
import React from "react";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { msToHMS } from "../time.js";

export default function Post({ sub, setAlert, setAlertMessage }) {
  const [showmore, setShowMore] = useState(false);
  const [showleft, setShowLeft] = useState(true);

  const left = () => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .get(
        API_URL +
          `/subgreddit/${sub?.name}/left?user=${
            JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
              .user_name
          }`,
        {
          headers: headers,
        }
      )
      .then((resp) => {
        setShowLeft(false);
        setAlert(true);
        setAlertMessage({
          msg: `Lefted SubGreddit ${sub?.name}`,
          sev: "success",
        });
        setTimeout(() => {
          setAlert(false);
        }, 10000);
        window.location.reload(false);
      })
      .catch((err) => {
        alert(err.response.data.msg);
      });
  };
  const addPage = (sub_name) => {
    let ar = JSON.parse(localStorage.getItem("greddit_opened_subs")).opened;
    if (!ar.includes(sub_name)) {
      ar = [sub_name, ...ar];
    }
    localStorage.setItem("greddit_opened_subs", JSON.stringify({ opened: ar }));
    // nav("/dashboard/subgreddit_" + sub_name);
    window.open("/dashboard/subgreddit_" + sub_name, "_blank");
  };
  return (
    <div
      className="post"
      style={{
        width: "45%",
        display: "inline-block",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            {/* <img className="postProfileImg" src={img_avatar} alt="" />
             */}
            <RedditIcon style={{ color: "#00907b" }} />
            <span className="postUsername">g/{sub?.name}</span>by
            <span className="postUsername">{sub?.createdBy}</span>
            <span className="postDate" style={{ marginRight: "5px" }}>
              created
            </span>
            <span className="postDate">
              {msToHMS(
                new Date().getTime() - new Date(sub.createdAt).getTime()
              )}
            </span>
          </div>
          <div className="postTopRight">
            {sub?.followers?.includes(
              JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                .user_name
            ) &&
              JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                .user_name !== sub?.createdBy &&
              showleft && <ExitToAppIcon className="delete" onClick={left} />}
            <OpenInNewIcon
              className="open"
              onClick={() => addPage(sub?.name)}
            />
            {/* <DeleteIcon className="delete" onClick={remove} /> */}
          </div>
        </div>
        <div className="postCenter">
          <div>
            <span className="postHeading">name</span>
            <span className="postText">{sub?.name}</span>
          </div>

          <span className="postHeading">description</span>
          <span className="postText">
            {!showmore && sub?.description?.slice(0, 100)}
            {showmore && sub?.description}
            {sub?.description?.length > 100 && (
              <button
                className="f_button"
                style={{ width: "auto" }}
                onClick={() => setShowMore(!showmore)}
              >
                {showmore ? "less" : "more"}
              </button>
            )}
          </span>
          <span className="postHeading">banned keywords</span>
          <span className="postText">{sub?.banned_keywords?.join(", ")}</span>
          <span className="postText">
            {!sub?.banned_keywords?.length && "No banned keywords"}
          </span>
          <span className="postHeading">tags</span>
          <span className="postText">{sub?.tags?.join(", ")}</span>
          <span className="postText">{!sub?.tags?.length && "No tags"}</span>
          <span className="postHeading">
            {sub?.followers_num}
            {sub?.followers_num > 1 ? " Followers_" : " Follower_"}
          </span>
          {/* <span className="postText">{sub?.followers?.length}</span> */}
          <span className="postHeading">
            {sub?.posts?.length}
            {sub?.posts?.length > 1 ? " Posts" : " Post"}
          </span>

          {/* <span className="postText">{sub?.posts?.length}</span> */}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {/* <ThumbUpIcon className="likeIcon" onClick={likeHandler} alt="" />
            <ThumbDownIcon className="likeIcon" onClick={likeHandler} alt="" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
