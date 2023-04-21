import React, { useEffect, useState } from "react";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import profilePic from "../../../../media/login/download.png";
import "./profile.css";
import Loader from "../../components/loader/Loader";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
// import { useFetch } from "../../useFetch";

const Prof = () => {
  // const data = useFetch(
  //   API_URL +
  //     `/user/${
  //       JSON.parse(localStorage.getItem("greddit_user_loggedin")).user.user_name
  //     }`
  // );

  const [item, setItem] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    // console.log("rendered");
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    setLoader(true);
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
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);

  return (
    <>
      {loader && <Loader />}
      <div className="profileRight">
        <div className="profileRightTop">
          <div className="profileCover">
            <img
              className="profileCoverImg"
              src="https://images.hdqwalls.com/download/reddit-cartoon-4k-io-1920x1080.jpg"
              alt=""
            />
            <img className="profileUserImg" src={profilePic} alt="" />
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">{item.user_name}</h4>
            <span className="profileInfoDesc">Hello my friends!</span>
          </div>
        </div>
        <div className="profileRightBottom">
          <Feed
            key={item.user_name}
            user={item.user_name}
            following={item?.following}
            saved_posts={item?.saved_posts}
            type="user"
          />
          <Rightbar key={item} profile item={item} />
        </div>
      </div>
    </>
  );
};

export default Prof;
