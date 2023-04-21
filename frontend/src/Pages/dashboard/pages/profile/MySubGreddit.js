import React, { useEffect, useState } from "react";
import MySubs from "../../components/mysubs/MySubs";
import profilePic from "../../../../media/login/download.png";
import "./profile.css";
// import { useFetch } from "../../useFetch";

const Prof = () => {
  return (
    <>
      <div className="profileRight">
        <div className="profileRightTop">
          <div className="profileCover">
            <img
              className="profileCoverImg"
              src="https://images6.alphacoders.com/112/1128590.jpg"
              alt=""
            />
            <img className="profileUserImg" src={profilePic} alt="" />
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">My SubGreddits</h4>
          </div>
        </div>
        <div className="profileRightBottom">
          <MySubs />
          {/* <Rightbar /> */}
        </div>
      </div>
    </>
  );
};

// const MySubs = () => {};

export default Prof;
