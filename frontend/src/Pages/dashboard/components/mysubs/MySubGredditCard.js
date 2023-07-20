import "./css/card.css";
import DeleteIcon from "@mui/icons-material/Delete";
import RedditIcon from "@mui/icons-material/Reddit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { API_URL } from "../../../../API_URL";

import React from "react";
import axios from "axios";
import { useState } from "react";
import Loader from "../loader/Loader";
import { msToHMS } from "../../utility/time.js";
export default function Card({ sub, removeSub }) {
  const [loader, setLoader] = useState(false);
  const remove = (user) => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    setLoader(true);
    axios
      .post(
        API_URL + `/subgreddit/delete_sub/${sub?.name}`,
        {},
        {
          headers: headers,
        }
      )
      .then((resp) => {
        removeSub(sub?.name);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.msg);
        setLoader(false);
      });
  };
  const [showmore, setShowMore] = useState(false);

  const addPage = (sub_name) => {
    let ar = JSON.parse(localStorage.getItem("greddit_opened_subs")).opened;
    if (!ar.includes(sub_name)) {
      ar = [sub_name, ...ar];
    }
    localStorage.setItem("greddit_opened_subs", JSON.stringify({ opened: ar }));
    window.open("/dashboard/subgreddit_" + sub_name);
  };

  return (
    <>
      {loader && <Loader />}
      <div className="card">
        <div className="cardWrapper">
          <div className="cardTop">
            <div className="cardTopLeft">
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
              <OpenInNewIcon
                className="open"
                onClick={() => addPage(sub?.name)}
              />
              <DeleteIcon className="delete" onClick={remove} />
            </div>
          </div>
          <div className="cardCenter">
            <span className="cardHeading">name</span>
            <span className="cardText">{sub?.name}</span>
            <span className="cardHeading">createdBy</span>
            <span className="cardText">{sub?.createdBy}</span>
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
              {sub?.followers_num > 1 ? " Followers " : " Follower "}
            </span>
            <span className="cardHeading">
              {sub?.posts?.length}
              {sub?.posts?.length > 1 ? " Posts" : " Post"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
