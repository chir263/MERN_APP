import "./feed.css";
import { useState } from "react";
import React from "react";
import Feed from "../feed/Feed";
import PostForm from "./CreateSub";

const MySubs = React.memo(({ subdata, following, saved_posts }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {subdata?.followers?.includes(
          JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
            .user_name
        ) && (
          <button
            type="submit"
            className="up_button"
            onClick={() => setShowModal(true)}
            style={{ marginLeft: "20px" }}
          >
            Post
          </button>
        )}

        {showModal && (
          <div id="myModal" className="modal">
            <div className="modal-content">
              <PostForm setShowModal={setShowModal} sub_name={subdata?.name} />
            </div>
          </div>
        )}
        <div></div>
        <div></div>
        <Feed
          key={subdata?.name}
          user={subdata?.name}
          following={following}
          saved_posts={saved_posts}
          type="subgreddit"
          post_num={subdata?.posts?.length}
          following_sub={subdata?.followers?.includes(
            JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
              .user_name
          )}
        />
        <div></div>
      </div>
    </div>
  );
});
export default MySubs;
