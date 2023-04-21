import "./feed.css";
import React from "react";
import Feed from "../feed/Feed";

const MySubs = React.memo(({ following, saved_posts }) => {
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Feed
          key={Math.random()}
          user={"subdata?.name"}
          following={following}
          saved_posts={saved_posts}
          type="savedpost"
          my_sp={true}
        />
        <div></div>
      </div>
    </div>
  );
});
export default MySubs;
