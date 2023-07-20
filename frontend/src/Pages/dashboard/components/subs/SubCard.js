import "./css/card.css";
import RedditIcon from "@mui/icons-material/Reddit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { API_URL } from "../../../../API_URL";
import { useState } from "react";
import React from "react";
import axios from "axios";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { msToHMS } from "../../utility/time.js";

export default function SubCard({ sub, setAlert, setAlertMessage }) {
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
      className="card"
      style={{
        width: "45%",
        display: "inline-block",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      <div className="cardWrapper">
        <div className="cardTop">
          <div className="cardTopLeft">
            {/* <img className="cardProfileImg" src={img_avatar} alt="" />
             */}
            <RedditIcon style={{ color: "#00907b" }} />
            <span className="cardUsername">g/{sub?.name}</span>by
            <span className="cardUsername">{sub?.createdBy}</span>
            <span className="cardDate" style={{ marginRight: "5px" }}>
              created
            </span>
            <span className="cardDate">
              {msToHMS(
                new Date().getTime() - new Date(sub.createdAt).getTime()
              )}
            </span>
          </div>
          <div className="cardTopRight">
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
        <div className="cardCenter">
          <div>
            <span className="cardHeading">name</span>
            <span className="cardText">{sub?.name}</span>
          </div>
          <span className="cardHeading">description</span>
          <span className="cardText">
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
          <span className="cardHeading">banned keywords</span>
          <span className="cardText">{sub?.banned_keywords?.join(", ")}</span>
          <span className="cardText">
            {!sub?.banned_keywords?.length && "No banned keywords"}
          </span>
          <span className="cardHeading">tags</span>
          <span className="cardText">{sub?.tags?.join(", ")}</span>
          <span className="cardText">{!sub?.tags?.length && "No tags"}</span>
          <span className="cardHeading">
            {sub?.followers_num}
            {sub?.followers_num > 1 ? " Followers" : " Follower"}
          </span>
          <br />
          <span className="cardHeading">
            {sub?.posts?.length}
            {sub?.posts?.length > 1 ? " posts" : " post"}
          </span>
        </div>
        <div className="cardBottom">
          <div className="cardBottomLeft"></div>
        </div>
      </div>
    </div>
  );
}
