import "./share1.css";
import RedditIcon from "@mui/icons-material/Reddit";
// import src from "./sc.js";
import { useState } from "react";
import { API_URL } from "../../../../API_URL";
import Alert from "@mui/material/Alert";
import Loader from "../loader/Loader";
import React from "react";
import axios from "axios";
export default function Share({ addSub, setShowModal, sub_name }) {
  const [text, setText] = useState("");
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState({
    msg: "Updated successfully",
    sev: "success",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    const body = {
      name: text,
      posted_by: JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
        .user_name,
      posted_in: sub_name,
    };
    setLoader(true);
    axios
      .post(API_URL + `/post/`, body, {
        headers: headers,
      })
      .then((resp) => {
        // addSub(resp.data.sub);
        setAlert(true);
        setAlertMessage({
          msg: `Post created successfullty`,
          sev: "success",
        });
        setLoader(false);
        setTimeout(() => {
          setAlert(false);
        }, 10000);
        window.location.reload(false);
      })
      .catch((err) => {
        setAlert(true);
        setLoader(false);
        setAlertMessage({
          msg: `${err.response.status}:${err.response.data.msg}`,
          sev: "error",
        });
        setTimeout(() => {
          setAlert(false);
        }, 10000);
        console.log(err);
      });
  };
  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.name === "description") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      e.target.parentElement.parentElement.parentElement.parentElement.style.height +=
        e.target.scrollHeight;
    }
  };
  return (
    <>
      {loader && <Loader />}
      <div className="share_">
        <div className="shareWrapper_">
          <span className="close" onClick={() => setShowModal(false)}>
            &times;
          </span>
          <RedditIcon style={{ color: "#00907b" }} />
          <h2 className="tophead">New Post</h2>
          {alert && (
            <Alert severity={alertmessage.sev} sx={{ mt: 3, mb: 2 }}>
              {alertmessage.msg}
            </Alert>
          )}
          <div className="shareTop">
            <form
              className="newForm"
              style={{ width: "100%" }}
              onSubmit={handleSubmit}
            >
              <label className="lab">Posted by</label>
              <br></br>
              <input
                type="text"
                name="name"
                className="inp"
                value={
                  JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                    .user_name
                }
                disabled={true}
              ></input>
              <br></br>
              <br></br>
              <label className="lab">Posted in</label>
              <br></br>
              <input
                type="text"
                name="name"
                className="inp"
                value={sub_name}
                disabled={true}
              ></input>
              <br></br>
              <br></br>
              <label className="lab">description</label>
              <br></br>
              <textarea
                id="autoresizing"
                name="description"
                value={text}
                onChange={handleChange}
                style={{ width: "90%" }}
                className="inp"
              ></textarea>
              <br></br>
              <button className="up_button" style={{ width: "20%" }}>
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
