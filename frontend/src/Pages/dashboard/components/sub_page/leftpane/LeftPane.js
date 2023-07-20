import "./rightbar.css";
// import Online from "../online/Online";
import { useState, useEffect } from "react";
import { API_URL } from "../../../../../API_URL";
import RedditIcon from "@mui/icons-material/Reddit";
import React from "react";
import axios from "axios";
import { msToHMS } from "../../../utility/time.js";
const Rightbar = React.memo(({ subdata }) => {
  const userr = JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
    .user_name;
  const [lef, setLef] = useState(false);
  // setRequest(false);
  const requestSub = () => {
    if (subdata?.left?.includes(userr)) {
      // alert("you left this sub");
      setLef(true);
      return;
    }
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .get(API_URL + `/subgreddit/${subdata?.name}/request?user=${userr}`, {
        headers: headers,
      })
      .then((resp) => {
        // setList(resp.data.users);
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HomeRightbar = () => {
    const [showmore, setShowMore] = useState(false);
    // console.log("subs", subdata);
    return (
      <>
        <img
          style={{ width: "100%", height: "inherit", objectFit: "cover" }}
          src="https://images6.alphacoders.com/112/1128590.jpg"
          alt=""
        />
        {/* <div className="post"> */}
        <div className="postWrapper" style={{ paddingRight: "0" }}>
          <div className="postTop">
            <div className="postTopLeft">
              {/* <img className="postProfileImg" src={img_avatar} alt="" />
               */}
              <RedditIcon style={{ color: "#00907b" }} />
              <span className="postUsername">g/{subdata?.name}</span>by
              <span className="postUsername">{subdata?.createdBy}</span>
              <span className="postDate" style={{ marginRight: "5px" }}>
                created
              </span>
              <span className="postDate">
                {msToHMS(
                  new Date().getTime() - new Date(subdata?.createdAt).getTime()
                )}
              </span>
            </div>
          </div>
          <div className="postCenter">
            <span className="postHeading">
              {subdata?.followers_num}
              {subdata?.followers_num > 1 ? " Followers " : " Follower "}
            </span>
            {"\t"}
            <span className="postHeading">
              {subdata?.posts?.length}
              {subdata?.posts?.length > 1 ? " Posts" : " Post"}
            </span>
            {subdata?.followers?.includes(userr) && (
              <span style={{ margin: "2px", color: "#474747", float: "right" }}>
                {"Following  "}
              </span>
            )}
            {subdata?.blocked?.includes(userr) && (
              <span style={{ margin: "2px", color: "#474747", float: "right" }}>
                {"Blocked  "}
              </span>
            )}
            {subdata?.resquests?.includes(userr) && (
              <span style={{ margin: "2px", color: "#474747", float: "right" }}>
                <i>{"Request pending  "}</i>
              </span>
            )}
            {lef && subdata?.left?.includes(userr) && (
              <span style={{ margin: "2px", color: "#474747", float: "right" }}>
                <i style={{ color: "red" }}>{"You left this sub  "}</i>
              </span>
            )}
            {!subdata?.followers?.includes(userr) &&
              !subdata?.resquests?.includes(userr) && (
                <button
                  className="follow_button"
                  style={{ marginLeft: "5px", padding: "2px" }}
                  onClick={() => requestSub()}
                >
                  Request Join
                </button>
              )}

            <br></br>
            <span className="postHeading">description</span>
            <span className="postText">
              {!showmore && subdata?.description?.slice(0, 100)}
              {showmore && subdata?.description}
              {subdata?.description?.length > 100 && (
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
            <span className="postText">
              {subdata?.banned_keywords?.join(", ")}
            </span>
            <span className="postText">
              {!subdata?.banned_keywords?.length && "No banned keywords"}
            </span>
            <span className="postHeading">tags</span>
            <span className="postText">{subdata?.tags?.join(", ")}</span>
            <span className="postText">
              {!subdata?.tags?.length && "No tags"}
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
        {/* </div> */}
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">{<HomeRightbar />}</div>
    </div>
  );
});

export default Rightbar;
