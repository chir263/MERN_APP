import React, { useEffect, useState } from "react";
import SavedPosts from "../../components/saved_post/SavedPosts";
import "./css/profile.css";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
const SavedPostComponent = () => {
  const [item, setItem] = useState([]);
  useEffect(() => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .get(
        API_URL +
          `/user/${
            JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
              .user_name
          }`,
        { headers }
      )
      .then((resp) => {
        setItem(resp.data.User);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log(subdata);
  // console.log("subpage", item);
  return (
    <>
      <div style={{ display: "block", width: "80%" }}>
        <div className="profileRight">
          <div className="profileRightTop">
            <br></br>
            <div className="profileInfo">
              <h4 className="profileInfoName">Saved Posts</h4>
            </div>
          </div>
          <div className="profileRightBottom">
            <SavedPosts
              saved_posts={item?.saved_posts}
              following={item?.following}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SavedPostComponent;
