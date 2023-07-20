import Post from "../post/Post";
import "./feed.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import React from "react";
import Loader from "../loader/Loader";
import { useCallback, useRef } from "react";

const Feed = React.memo(
  ({ user, following, type, saved_posts, my_sp, post_num, following_sub }) => {
    const [postlist, setPostList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [pagenumber, setPageNumber] = useState(1);
    useEffect(() => {
      if (user) {
        const headers = {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
          }`,
        };
        setLoader(true);
        axios
          .get(API_URL + `/post/${type}/${user}?page=${pagenumber}`, {
            headers,
          })
          .then((resp) => {
            setPostList([...postlist, ...resp.data.post]);
            setLoader(false);
          })
          .catch((err) => {
            console.log(err);
            setLoader(false);
          });
      }
    }, [user, pagenumber]);

    const observer = useRef();
    const lastPost = useCallback(
      (node) => {
        if (loader) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && postlist.length < post_num) {
            setPageNumber((pagenumber) => pagenumber + 1);
          }
        });
        if (node) observer.current.observe(node);
      },
      [loader]
    );

    const removepost = (post_id) => {
      const headers = {
        authorization: `Bearer ${
          JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
        }`,
      };
      axios
        .post(API_URL + `/user/post/${post_id}?op=remove`, {}, { headers })
        .then((resp) => {
          setPostList(
            postlist
              .filter((post) => post._id !== post_id)
              ?.slice()
              .reverse()
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <>
        {loader && <Loader />}
        <div className="feed">
          <div className="feedWrapper">
            {/* <Share /> */}
            {postlist &&
              postlist?.slice().map((p, index) => {
                if (postlist.length === index + 1)
                  return (
                    <>
                      <div key={Math.random()}>
                        <Post
                          post={p}
                          following={following}
                          saved_posts={saved_posts}
                          my_sp={my_sp}
                          removepost={removepost}
                          following_sub={following_sub}
                        />
                      </div>
                      <div ref={lastPost}></div>
                    </>
                  );
                else
                  return (
                    <div key={Math.random()}>
                      <Post
                        post={p}
                        following={following}
                        saved_posts={saved_posts}
                        my_sp={my_sp}
                        removepost={removepost}
                        following_sub={following_sub}
                      />
                    </div>
                  );
              })}
            {postlist && postlist.length === 0 && (
              <h2 style={{ color: "#848484" }}>No posts yet</h2>
            )}
          </div>
        </div>
      </>
    );
  }
);
export default Feed;
