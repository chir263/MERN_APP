import "./share.css";
import RedditIcon from "@mui/icons-material/Reddit";
// import src from "./sc.js";
import { useState } from "react";
import { API_URL } from "../../../../API_URL";

import React from "react";
import axios from "axios";
import Loader from "../loader/Loader";

export default function Share({ addSub, setAlert, setAlertMessage }) {
  const [formValues, setFormValues] = useState({
    name: {
      value: "",
      error: false,
    },
    description: {
      value: "",
      error: false,
    },
    banned_keywords: {
      value: "",
      error: false,
    },
    tags: {
      value: "",
      error: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
      },
    });
    if (name === "description") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
      e.target.parentElement.parentElement.parentElement.parentElement.style.height +=
        e.target.scrollHeight;
    }
    // );
  };
  const [loader, setLoader] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    const body = {
      name: formValues.name.value,
      description: formValues.description.value,
      banned_keywords: formValues.banned_keywords.value
        ?.split(",")
        .map((x) => x.trim())
        .filter((x) => x !== ""),
      tags: formValues.tags.value
        ?.split(",")
        .map((x) => x.trim())
        .filter((x) => x !== ""),
    };
    setLoader(true);
    axios
      .post(API_URL + `/subgreddit/`, body, {
        headers: headers,
      })
      .then((resp) => {
        addSub(resp.data.sub);
        setLoader(false);
      })
      .catch((err) => {
        setAlert(true);
        setAlertMessage({
          msg: `${err.response.status}:${err.response.data.msg}`,
          sev: "error",
        });
        setTimeout(() => {
          setAlert(false);
        }, 10000);
        console.log(err);
        setLoader(false);
      });
  };

  return (
    <>
      {loader && <Loader />}
      <div className="share_">
        <div className="shareWrapper">
          <RedditIcon style={{ color: "#00907b" }} />
          <h2 className="tophead">New SubGreddiit</h2>

          <div className="shareTop">
            <form
              className="newForm"
              style={{ width: "100%" }}
              onSubmit={handleSubmit}
            >
              <label className="lab">
                name <label style={{ fontSize: "14px" }}>(unique)</label>
              </label>
              <br></br>
              <input
                type="text"
                name="name"
                className="inp"
                value={formValues.name.value}
                onChange={handleChange}
              ></input>
              <br></br>
              <br></br>
              <label className="lab">description</label>
              <br></br>
              <textarea
                id="autoresizing"
                name="description"
                value={formValues.description.value}
                onChange={handleChange}
                style={{ width: "90%" }}
                className="inp"
              ></textarea>
              <br></br>
              <label className="lab">
                banned keywords{" "}
                <label style={{ fontSize: "14px" }}>(comma separated)</label>
              </label>
              <br></br>
              <input
                name="banned_keywords"
                type="text"
                className="inp"
                style={{ width: "90%" }}
                value={formValues.banned_keywords.value}
                onChange={handleChange}
              ></input>
              <br></br>
              <br></br>
              <label className="lab">
                tags{" "}
                <label style={{ fontSize: "14px" }}>(comma separated)</label>
              </label>
              <br></br>
              <input
                name="tags"
                type="text"
                className="inp"
                style={{ width: "90%" }}
                value={formValues.tags.value}
                onChange={handleChange}
              ></input>
              <br></br>
              <br></br>
              <button className="up_button" style={{ width: "20%" }}>
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
