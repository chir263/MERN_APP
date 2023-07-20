import "./post.css";
import { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import img_avatar from "../../../../media/user.png";
import { follow } from "../../utility/Follow";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from "@mui/material/Alert";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { msToHMS } from "../../utility/time.js";
export default function Post({
  post,
  following,
  saved_posts,
  my_sp,
  removepost,
  reported_post,
  following_sub,
}) {
  const [x, setX] = useState(false);
  const [y, setY] = useState(false);

  const savepost = (post_id) => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .post(API_URL + `/user/post/${post_id}?op=save`, {}, { headers })
      .then((resp) => {
        setY(true);
        saved_posts?.push(post?._id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const ussr = JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
    .user_name;
  const [up, setUp] = useState(post?.upvotes?.length);
  const [upt, setUpT] = useState(post?.upvotes?.includes(ussr));
  const [down, setDown] = useState(post?.downvotes?.length);
  const [downt, setDownT] = useState(post?.downvotes?.includes(ussr));

  const updatePost = (op) => {
    let opp = "";
    if (op === "up") {
      if (!upt && !downt) opp = "up";
      else if (!upt && downt) opp = "up";
      else if (upt && !downt) opp = "rup";
      else return;
    } else if (op === "down") {
      if (!upt && !downt) opp = "down";
      else if (!upt && downt) opp = "rdown";
      else if (upt && !downt) opp = "down";
      else return;
    }
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .patch(
        API_URL + `/post/${post?._id}?op=${opp}`,
        {},
        {
          headers: headers,
        }
      )
      .then((resp) => {
        if (opp === "up") {
          setUp(up + 1);
          setUpT(true);
          if (downt) {
            setDown(down - 1);
            setDownT(false);
          }
        } else if (opp === "down") {
          setDown(down + 1);
          setDownT(true);
          if (upt) {
            setUp(up - 1);
            setUpT(false);
          }
        } else if (opp === "rup") {
          setUp(up - 1);
          setUpT(false);
        } else if (opp === "rdown") {
          setDown(down - 1);
          setDownT(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [showComment, setComment] = useState(false);
  const [commentlist, setcom] = useState([]);
  const addComment = () => {
    let text = document.getElementById(`comt_${post?._id}`).value;
    if (text === "") return;
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .post(
        API_URL + `/comment/`,
        {
          comment: text,
          commented_in: post?.posted_in,
          commented_post: post?._id,
          root: true,
        },
        {
          headers: headers,
        }
      )
      .then((resp) => {
        setcom([resp.data.comment, ...commentlist]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [rep, setRep] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const handleMouseUp = () => {
    const str = window.getSelection().toString();
    // console.log(`Selected text: ${}`);
    if (str !== "") {
      setSelectedText(str);
    }
  };
  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState({
    msg: "Updated successfully",
    sev: "success",
  });

  const report = () => {
    const concern = document.getElementById("concern").value;
    const selectedtext = document.getElementById("selectedtext").innerText;
    if (concern === "") {
      setAlert(true);
      setAlertMessage({
        msg: `Please type concern`,
        sev: "error",
      });
      setTimeout(() => {
        setAlert(false);
      }, 10000);
      return;
    }
    if (selectedtext === "" || !selectedtext) {
      setAlert(true);
      setAlertMessage({
        msg: `Please select text to be reported`,
        sev: "error",
      });
      setTimeout(() => {
        setAlert(false);
      }, 10000);
      return;
    }
    if (
      post?.posted_by ===
      JSON.parse(localStorage.getItem("greddit_user_loggedin")).user.user_name
    ) {
      setAlert(true);
      setAlertMessage({
        msg: `You cannot report yourself`,
        sev: "error",
      });
      setTimeout(() => {
        setAlert(false);
      }, 10000);
      return;
    }
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    const body = {
      concern: concern,
      reported_user: post?.posted_by,
      post_associated_with: post?._id,
      reported_in: post?.posted_in,
      selected_text: selectedtext,
    };
    axios
      .post(API_URL + `/report/`, body, {
        headers: headers,
      })
      .then((resp) => {
        // addSub(resp.data.sub);
        setAlert(true);
        setAlertMessage({
          msg: `Reported successfullty`,
          sev: "success",
        });
        setTimeout(() => {
          setAlert(false);
          setRep(false);
        }, 2000);
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
      });
  };

  useEffect(() => {
    if (!reported_post) {
      const headers = {
        authorization: `Bearer ${
          JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
        }`,
      };
      axios
        .post(
          API_URL + `/comment/${post?._id}`,
          { root: true },
          {
            headers,
          }
        )
        .then((resp) => {
          setcom(resp.data.comments);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img className="postProfileImg" src={img_avatar} alt="" />
            <span className="postUsername">
              {post?.posted_by_blocked ? (
                <span style={{ color: "red" }}>blocked_user</span>
              ) : (
                post.posted_by
              )}
            </span>
            in
            <span className="postUsername">g/{post.posted_in}</span>
            <span className="postDate">
              {msToHMS(
                new Date().getTime() - new Date(post.createdAt).getTime()
              )}
            </span>
          </div>
          <div className="postTopRight">
            {!reported_post &&
              JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                .user_name !== post?.posted_by &&
              !following.includes(post?.posted_by) &&
              !x &&
              !post?.posted_by_blocked && (
                <button
                  className="follow_button"
                  onClick={() => {
                    follow(post?.posted_by, setX);
                    following?.push(post?.posted_by);
                  }}
                >
                  {"Follow "} {post.posted_by}
                </button>
              )}
            {((JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
              .user_name !== post?.posted_by &&
              following.includes(post?.posted_by)) ||
              x) && (
              <span style={{ margin: "2px", color: "#474747" }}>
                {"following  "}
              </span>
            )}
            {!reported_post && !saved_posts?.includes(post?._id) && !y && (
              <button
                className="follow_button"
                onClick={() => {
                  // follow(post?.posted_by, setX);
                  savepost(post?._id);
                  // location.reload();
                  // window.location.reload(false);
                }}
              >
                {"Save Post "}
              </button>
            )}
            {(saved_posts?.includes(post?._id) || y) && (
              <span style={{ margin: "2px", color: "#474747" }}>
                {"Saved  "}
              </span>
            )}
          </div>
        </div>
        <div className="postCenter">
          {/* {console.log(post?.alert, post?.name)} */}
          {post?.alert !== "" && (
            <p style={{ color: "red", fontSize: "14px" }}>{post?.alert}</p>
          )}
          <span className="postText_" onMouseUp={handleMouseUp}>
            {post?.name}
          </span>
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {!reported_post && (
              <ReportProblemIcon
                className="delete"
                style={{ float: "right", marginRight: "10px" }}
                onClick={() => setRep(!rep)}
              />
            )}
            <ThumbUpIcon
              className={upt ? "activeIcon" : "likeIcon"}
              onClick={() => updatePost("up")}
              alt=""
            />
            {up > 0 && up}{" "}
            <ThumbDownIcon
              className={downt ? "activeIcon" : "likeIcon"}
              onClick={() => updatePost("down")}
              alt=""
            />
            {down > 0 && down}
            {my_sp && (
              <DeleteIcon
                className="delete"
                style={{ float: "right" }}
                onClick={() => removepost(post?._id)}
              />
            )}
          </div>
        </div>
        <br />
        {rep && (
          <div style={{ backgroundColor: "#f4f4f4", padding: "10px" }}>
            <span style={{ fontSize: "17px" }}>Report</span>
            <br />
            {alert && (
              <Alert severity={alertmessage.sev} sx={{ mt: 3, mb: 2 }}>
                {alertmessage.msg}
              </Alert>
            )}
            <br />
            <span className="replabel">Concern</span>
            <br />
            {/* <span className="selectedtext">{selectedText}</span>
             */}
            <input type="text" className="concern" id="concern"></input>
            <br />
            <span className="replabel">Text to be reported</span>
            <br />
            <span className="selectedtext" id="selectedtext">
              {selectedText}
            </span>
            {/* <br></br> */}
            <button className="follow_button" onClick={report}>
              {"Report "}
            </button>
          </div>
        )}
        <div>
          {!reported_post && (
            <button
              type="button"
              className="f_button"
              onClick={() => setComment(!showComment)}
            >
              Comments
            </button>
          )}
          {showComment && (
            <div>
              {following_sub && (
                <div>
                  <input
                    type="text"
                    className="commentInp"
                    id={`comt_${post?._id}`}
                  ></input>
                  <button className="commentbtn" onClick={() => addComment()}>
                    {">"}
                  </button>
                </div>
              )}
              <hr
                style={{
                  marginTop: "20px",
                  marginLeft: "10px",
                  marginRight: "20px",
                  border: "2px solid #dcdcdc",
                  borderRadius: "1px",
                }}
              />
              <div className="commentBox">
                {commentlist && (
                  <CommentBox
                    comment_data={commentlist}
                    following_sub={following_sub}
                  />
                )}
              </div>
            </div>
          )}
          {showComment && commentlist?.length === 0 && "No comments"}
        </div>
      </div>
    </div>
  );
}

const CommentBox = ({ comment_data, following_sub }) => {
  return (
    <div>
      {comment_data.map((comment) => {
        return (
          <Comment
            com={comment}
            key={Math.random()}
            following_sub={following_sub}
          />
        );
      })}
    </div>
  );
};

const Comment = ({ com, nested, following_sub }) => {
  const [reply, showReply] = useState(false);
  const [child_comments, setChildComments] = useState(com.children || []);
  const [show_child_comments, setShowChildComments] = useState(false);
  const replyToComment = () => {
    let text = document.getElementById(`reply_${com?._id}`).value;
    // console.log(text);
    if (text === "") return;

    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    const body = {
      comment: text,
      commented_in: com?.commented_in,
      commented_post: com?.commented_post,
      parent_comment: com?._id,
    };
    axios
      .post(API_URL + `/comment/`, body, {
        headers: headers,
      })
      .then((resp) => {
        setChildComments([resp.data.comment, ...child_comments]);
        setShowChildComments(true);
        document.getElementById(`reply_${com?._id}`).value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadComments = () => {
    if (!show_child_comments) {
      const headers = {
        authorization: `Bearer ${
          JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
        }`,
      };
      axios
        .post(
          API_URL + `/comment/${com?.commented_post}`,
          { parent_comment: com?._id },
          {
            headers,
          }
        )
        .then((resp) => {
          setChildComments(resp.data.comments);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setShowChildComments(!show_child_comments);
  };

  return (
    <div className={nested ? "commentdiv" : "parent_comment"}>
      <span className={nested ? "nestedcommentby" : "commentby"}>
        <span className="username_">{com?.commented_by}</span>
        <span className="create">
          {msToHMS(new Date().getTime() - new Date(com?.createdAt).getTime())}
        </span>
      </span>
      {/* <br /> */}
      <span className="comment">{com?.comment}</span>
      <div className="children-comments">
        {/* {console.log(following_sub)} */}
        {following_sub && (
          <button
            className="f_button"
            style={{
              fontSize: "14px",
              padding: "1px",
              marginTop: "0",
              width: "auto",
            }}
            onClick={() => showReply(!reply)}
          >
            Reply
          </button>
        )}
        {"   "}
        {following_sub && (
          <button
            className="f_button"
            style={{ fontSize: "14px", padding: "1px", marginTop: "0" }}
            onClick={() => loadComments()}
          >
            Show replies
          </button>
        )}
        {reply && (
          <div className="replyBox" style={{ marginTop: "5px" }}>
            <input
              type="text"
              className="replyInp"
              id={`reply_${com?._id}`}
            ></input>
            <button className="replybtn" onClick={replyToComment}>
              {">"}
            </button>
          </div>
        )}
        {show_child_comments &&
          child_comments &&
          child_comments?.map((comment) => {
            return (
              <Comment
                com={comment}
                nested
                key={Math.random()}
                following_sub={following_sub}
              />
            );
          })}
      </div>
    </div>
  );
};
