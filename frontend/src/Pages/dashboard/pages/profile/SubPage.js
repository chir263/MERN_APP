import React, { startTransition, useEffect, useState } from "react";
import MySubs from "../../components/sub_page/MySubs";
import Rightbar from "../../components/sub_page/rightbar/Rightbar";
import "./profile.css";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import { useNavigate } from "react-router-dom";
import RedditIcon from "@mui/icons-material/Reddit";
import Post from "../../components/post/Post";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Loader from "../../components/loader/Loader";

import Error from "../../../Error";

const Prof = ({ sub_page, init, ops }) => {
  // console.log("current", sub_page);
  const nav = useNavigate();
  const [subdata, setSubData] = useState(null);
  const [item, setItem] = useState([]);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState({
    followers: subdata?.followers,
    blocked: subdata?.blocked,
    left: subdata?.left,
  });
  const [err404, setErr404] = useState(false);
  useEffect(() => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    setErr404(false);
    setLoader(true);
    axios
      .get(API_URL + `/subgreddit/sub/${sub_page}`, { headers })
      .then((resp) => {
        setSubData(resp.data.subgreddit);
        setUserData({
          followers: resp.data.subgreddit?.followers,
          blocked: resp.data.subgreddit?.blocked,
          left: resp.data.subgreddit?.left,
        });
        setLoader(false);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setErr404(true);
        } else {
          console.log(err);
        }
        setLoader(false);
      });

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
  }, [sub_page]);
  // console.log(subdata);
  // console.log("subpage", item);

  return (
    <>
      {err404 && <Error text="404 Not Found" />}
      {!err404 && (
        <>
          {loader && <Loader />}
          <div style={{ display: "block", width: "80%" }}>
            {subdata?.moderators?.includes(
              JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                .user_name
            ) && (
              <>
                <div
                  style={{
                    backgroundColor: "#eaeaea",
                    margin: "0px",
                    display: "block",
                    position: "fixed",
                    borderBottomRightRadius: "15px",
                    zIndex: 99,
                  }}
                >
                  <button
                    className={
                      ops === "users" ? "active_but" : "nav_sub_button"
                    }
                    onClick={() => {
                      if (ops === "users")
                        nav(`/dashboard/subgreddit_${sub_page}`);
                      else nav(`/dashboard/subgreddit_${sub_page}/users`);
                    }}
                  >
                    Users
                  </button>
                  <button
                    className={
                      ops === "requests" ? "active_but" : "nav_sub_button"
                    }
                    onClick={() => {
                      if (ops === "requests")
                        nav(`/dashboard/subgreddit_${sub_page}`);
                      else nav(`/dashboard/subgreddit_${sub_page}/requests`);
                    }}
                  >
                    Joining Requests
                  </button>
                  <button
                    className={
                      ops === "stats" ? "active_but" : "nav_sub_button"
                    }
                    onClick={() => {
                      if (ops === "stats")
                        nav(`/dashboard/subgreddit_${sub_page}`);
                      else nav(`/dashboard/subgreddit_${sub_page}/stats`);
                    }}
                  >
                    Stats
                  </button>
                  <button
                    className={
                      ops === "reports" ? "active_but" : "nav_sub_button"
                    }
                    style={{ borderBottomRightRadius: "15px" }}
                    onClick={() => {
                      if (ops === "reports")
                        nav(`/dashboard/subgreddit_${sub_page}`);
                      else nav(`/dashboard/subgreddit_${sub_page}/reports`);
                    }}
                  >
                    Reported
                  </button>
                </div>

                <div style={{ display: "inline" }}>
                  <div id="users">
                    {/* {console.log(userData)} */}
                    {ops === "users" && (
                      <User
                        followers={userData?.followers}
                        blocked={userData?.blocked}
                        left={userData?.left}
                      />
                    )}
                  </div>
                  <div id="requests">
                    {ops === "requests" && (
                      <Request
                        resquests={subdata?.resquests}
                        sub_page={sub_page}
                        setUserData={setUserData}
                        userData={userData}
                      />
                    )}
                  </div>
                  <div id="stats">
                    {ops === "stats" && (
                      <Stats
                        date_stats={subdata?.date_stats}
                        sub_name={subdata?.name}
                        num_reports={subdata?.reports_num}
                        num_resolved={subdata?.reports_resolved?.length}
                      />
                    )}
                  </div>
                  <div id="reports">
                    {ops === "reports" && (
                      <Reports
                        reports={subdata?.new_reports}
                        sub_name={subdata?.name}
                        following={item?.following}
                        saved_posts={item?.saved_posts}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
            {(!(
              ops === "users" ||
              ops === "requests" ||
              ops === "stats" ||
              ops === "reports"
            ) ||
              !subdata?.moderators?.includes(
                JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                  .user_name
              )) && (
              <div className="profileRight">
                <div className="profileRightTop">
                  <br></br>
                  <div className="profileInfo">
                    <h4 className="profileInfoName">g/{sub_page}</h4>
                  </div>
                </div>
                <div className="profileRightBottom">
                  <Rightbar subdata={subdata} />
                  <MySubs
                    subdata={subdata}
                    following={item?.following}
                    saved_posts={item?.saved_posts}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

const User = ({ followers, blocked, left }) => {
  // console.log(followers, blocked, left);
  const [init_f, setInit_f] = useState(5);
  const [init_b, setInit_b] = useState(5);
  const [init_l, setInit_l] = useState(5);
  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <span
        style={{
          fontSize: "20px",
          padding: "10px",
          backgroundColor: "#f1f1f1",
          color: "#8a8a8a",
        }}
      >
        Users
      </span>
      <br></br>

      <div className="flex-container">
        <div className="flex-item-left">
          <p className="user_f_head">Followers</p>
          <div className="cnt">
            {followers?.slice(0, init_f)?.map((f) => {
              return <span className="user_item">{f}</span>;
            })}
            {followers?.length > 0 && (
              <button
                className="f_button_u"
                style={{ width: "auto" }}
                onClick={() => {
                  if (init_f > followers?.length) setInit_f(5);
                  else setInit_f(init_f + 5);
                }}
              >
                {init_f < followers?.length ? "more" : "less"}
              </button>
            )}
          </div>
        </div>
        <div className="flex-item-middle">
          <p className="user_f_head">Blocked</p>
          <div className="cnt">
            {blocked?.map((f) => {
              return <span className="user_item">{f}</span>;
            })}
            {blocked?.length > 0 && (
              <button
                className="f_button_u"
                style={{ width: "auto" }}
                onClick={() => {
                  if (init_b > blocked?.length) setInit_b(5);
                  else setInit_b(init_b + 5);
                }}
              >
                {init_b < blocked?.length ? "more" : "less"}
              </button>
            )}
          </div>
        </div>
        <div className="flex-item-right">
          <p className="user_f_head">Left</p>
          <div className="cnt">
            {left?.map((f) => {
              return <span className="user_item">{f}</span>;
            })}
            {left?.length > 0 && (
              <button
                className="f_button_u"
                style={{ width: "auto" }}
                onClick={() => {
                  if (init_l > left?.length) setInit_l(5);
                  else setInit_l(init_l + 5);
                }}
              >
                {init_l < left?.length ? "more" : "less"}
              </button>
            )}
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
    </>
  );
};

const Request = ({ resquests, sub_page, setUserData, userData }) => {
  // console.log(followers, blocked, left);
  // console.log("req", resquests);
  const [requests_list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const headers = {
    authorization: `Bearer ${
      JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
    }`,
  };
  const body = {
    userlist: resquests,
  };
  useEffect(() => {
    setLoader(true);
    axios
      .post(API_URL + `/user/`, body, {
        headers: headers,
      })
      .then((resp) => {
        setList(resp.data.users);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);

  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState({
    msg: "Error",
    sev: "error",
  });
  const accept = (user) => {
    setLoader(true);
    axios
      .get(API_URL + `/subgreddit/${sub_page}/accept?user=${user}`, {
        headers: headers,
      })
      .then((resp) => {
        // setList(resp.data.users);
        setAlert(true);
        setAlertMessage({
          msg: `Accepted ${user}`,
          sev: "success",
        });
        setTimeout(() => {
          setAlert(false);
        }, 10000);
        setUserData({ ...userData, followers: [...userData.followers, user] });
        setList(requests_list.filter((user_) => user_.user_name !== user));
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

  const reject = (user) => {
    setLoader(true);
    axios
      .get(API_URL + `/subgreddit/${sub_page}/reject?user=${user}`, {
        headers: headers,
      })
      .then((resp) => {
        // setList(resp.data.users);
        setAlert(true);
        setAlertMessage({
          msg: `Rejected ${user}`,
          sev: "success",
        });
        setTimeout(() => {
          setAlert(false);
        }, 10000);
        setList(requests_list.filter((user_) => user_.user_name !== user));
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
      <br></br>
      <br></br>
      <br></br>
      <span
        style={{
          fontSize: "20px",
          padding: "10px",
          backgroundColor: "#f1f1f1",
          color: "#8a8a8a",
        }}
      >
        Joining requests
      </span>
      <br></br>

      <div className="flex-container">
        <div className="requestcont">
          {alert && (
            <Alert severity={alertmessage.sev} sx={{ mt: 3, mb: 2 }}>
              {alertmessage.msg}
            </Alert>
          )}
          {requests_list?.length === 0 && (
            <div className="indiv" style={{ paddingTop: "30px" }}>
              {" "}
              No Joining requests
            </div>
          )}
          {requests_list?.map((user) => {
            return (
              <div className="req_users" key={Math.random()}>
                <button
                  className="follow_button"
                  onClick={() => accept(user.user_name)}
                >
                  Accept
                </button>
                <button
                  className="follow_button"
                  onClick={() => reject(user.user_name)}
                >
                  Reject
                </button>
                <div className="indiv">
                  <button className="f_button_u" style={{ width: "auto" }}>
                    {user.user_name}
                  </button>
                </div>
                <div className="indiv">
                  <span>{user.first_name + " " + user.last_name}</span>
                </div>
                <div className="indiv">
                  <span>
                    {user.age}
                    {" years"}
                  </span>
                </div>
                <div className="indiv">
                  <span>
                    {user.followers.length}
                    {user.followers.length === 1 ? " follower" : " followers"}
                  </span>
                </div>
                <div className="indiv">
                  <span>
                    {user.following.length}{" "}
                    {user.following.length === 1 ? " following" : " followings"}
                  </span>
                </div>

                {/* {console.log(user)} */}
              </div>
            );
          })}
        </div>
      </div>
      <br></br>
      <br></br>
    </>
  );
};

const Reports = ({ reports, sub_name, following, saved_posts }) => {
  const [requests_list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const headers = {
    authorization: `Bearer ${
      JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
    }`,
  };
  const body = {
    reportlist: reports,
  };
  useEffect(() => {
    setLoader(true);
    axios
      .post(API_URL + `/report/getreport/${sub_name}`, body, {
        headers: headers,
      })
      .then((resp) => {
        setList(resp.data.reports);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);

  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState({
    msg: "Error",
    sev: "error",
  });
  const [modaldata, setmodaldata] = useState(false);

  const updateReport = (op, post_id) => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    setLoader(true);
    axios
      .post(API_URL + `/report/ops/${post_id}/op/${op}`, {}, { headers })
      .then((resp) => {
        setLoader(false);
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  let map = {};
  const start = (id) => {
    let timeleft = 2;
    document.getElementById(`blockuser_${id}`).innerText = `Cancel in 3s`;
    map["interval"] = setInterval(function () {
      if (timeleft < 0) {
        clearInterval(map["interval"]);
        map["interval"] = null;
        updateReport("block_user", id);
        // console.log("blocked", id);
      } else {
        document.getElementById(
          `blockuser_${id}`
        ).innerText = `Cancel in ${timeleft}s`;
        timeleft -= 1;
      }
    }, 1000);
  };
  return (
    <>
      {loader && <Loader />}
      <br></br>
      <br></br>
      <br></br>
      {modaldata && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="share_">
              <div className="shareWrapper_">
                <span className="close" onClick={() => setmodaldata(false)}>
                  &times;
                </span>
                <RedditIcon style={{ color: "#00907b" }} />
                <h2 className="tophead">Report</h2>
                <div className="shareTop">
                  <form
                    className="newForm"
                    style={{ width: "100%" }}
                    // onSubmit={handleSubmit}
                  >
                    <label className="lab">Concern</label>
                    <br></br>
                    <textarea
                      id="autoresizing"
                      name="description"
                      value={modaldata?.concern}
                      // onChange={handleChange}
                      style={{ width: "90%" }}
                      className="inp"
                      disabled={true}
                    ></textarea>
                    <br></br>
                    <label className="lab">Reported Text</label>
                    <br></br>
                    <textarea
                      id="autoresizing"
                      name="description"
                      value={modaldata?.selected_text}
                      style={{ width: "90%", height: "250px" }}
                      className="inp"
                      disabled={true}
                    ></textarea>
                    <br></br>
                    <Post
                      post={modaldata?.post}
                      following={following}
                      saved_posts={saved_posts}
                      reported_post
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <span
        style={{
          fontSize: "20px",
          padding: "10px",
          backgroundColor: "#f1f1f1",
          color: "#8a8a8a",
        }}
      >
        Reports
      </span>
      <br></br>

      <div className="flex-container">
        <div className="requestcont">
          {alert && (
            <Alert severity={alertmessage.sev} sx={{ mt: 3, mb: 2 }}>
              {alertmessage.msg}
            </Alert>
          )}
          {requests_list?.length === 0 && (
            <div className="indiv" style={{ paddingTop: "30px" }}>
              {" "}
              No Reports
            </div>
          )}
          {requests_list
            ?.slice()
            ?.reverse()
            ?.map((report) => {
              return (
                <div className="report_row" key={Math.random()}>
                  <div className="rep_users">
                    <button
                      className={
                        report?.verdict !== "ignore"
                          ? "follow_button"
                          : "faded_button"
                      }
                      id={`blockuser_${report?._id}`}
                      onClick={() => {
                        if (map["interval"]) {
                          document.getElementById(
                            `blockuser_${report?._id}`
                          ).innerText = "Block User";
                          clearInterval(map["interval"]);
                          map["interval"] = null;
                        } else if (
                          report?.verdict !== "ignore" &&
                          !map["interval"]
                        ) {
                          start(report?._id);
                        }
                      }}
                    >
                      Block User
                    </button>
                    <button
                      className={
                        report?.verdict !== "ignore"
                          ? "follow_button"
                          : "faded_button"
                      }
                      onClick={() => {
                        if (report?.verdict !== "ignore")
                          updateReport("delete_post", report?._id);
                      }}
                      disabled={report?.verdict === "ignore"}
                    >
                      Delete Post
                    </button>
                    <button
                      className="follow_button"
                      onClick={() => {
                        if (report?.verdict !== "ignore")
                          updateReport("ignore", report?._id);
                      }}
                      disabled={report?.verdict === "ignore"}
                    >
                      Ignore
                    </button>
                    <div className="indiv">
                      Reported user
                      <button className="f_button_u" style={{ width: "auto" }}>
                        {report?.reported_user}
                      </button>
                    </div>
                    <div className="indiv">
                      Reported By
                      <button className="f_button_u" style={{ width: "auto" }}>
                        {report?.reported_by}
                      </button>
                    </div>
                    <div className="indiv">
                      <button className="f_button_u" style={{ width: "auto" }}>
                        g/{report?.reported_in}
                      </button>
                    </div>
                    <div className="indiv">
                      <button
                        className="follow_button"
                        onClick={() => {
                          const headers = {
                            authorization: `Bearer ${
                              JSON.parse(
                                localStorage.getItem("greddit_user_loggedin")
                              ).token
                            }`,
                          };
                          axios
                            .get(
                              API_URL + `/post/${report?.post_associated_with}`,
                              {
                                headers,
                              }
                            )
                            .then((resp) => {
                              setmodaldata({
                                concern: report?.concern,
                                selected_text: report?.selected_text,
                                report_id: report?._id,
                                post: resp.data.post,
                              });
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                      >
                        Open report
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <br></br>
      <br></br>
    </>
  );
};

const Stats = ({ date_stats, sub_name, num_reports, num_resolved }) => {
  // console.log(date_stats, sub_name);
  let newUsers = [];
  let newVisits = [];
  let newPosts = [];
  let myset = new Set();
  for (let aa of date_stats) {
    aa.new_users.forEach((item) => myset.add(item));
    aa?.left_users?.forEach((item) => myset.delete(item));
    newUsers.push({ name: aa.date[0], uv: myset.size, pv: 2400, amt: 2400 });
    newVisits.push({
      name: aa.date[0],
      uv: aa.num_visits.length,
      pv: 2400,
      amt: 2400,
    });
    newPosts.push({
      name: aa.date[0],
      uv: aa.new_posts.length,
      pv: 2400,
      amt: 2400,
    });
  }
  // console.log(newUsers);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value} members`}</p>
        </div>
      );
    }

    return null;
  };
  const CustomTooltip1 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value} visits`}</p>
        </div>
      );
    }

    return null;
  };
  const CustomTooltip2 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value} ${
            payload[0].value === 1 ? "post" : "posts"
          }`}</p>
        </div>
      );
    }

    return null;
  };
  return (
    <>
      <br></br>
      <br></br>
      <br></br>
      <span
        style={{
          fontSize: "20px",
          padding: "10px",
          backgroundColor: "#f1f1f1",
          color: "#8a8a8a",
        }}
      >
        Stats
      </span>
      <br></br>

      <div className="flex-container">
        <div className="statcont">
          <br />
          <br />
          <LineChart
            width={500}
            height={300}
            data={newUsers}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            className="chart"
          >
            <Line type="monotone" dataKey="uv" stroke="#00d7d2" />
            {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
             */}
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-40}
            ></XAxis>
            <YAxis>
              <Label
                value="Number of Members"
                angle={-90}
                position="outside"
                fontSize={14}
                fill="#676767"
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
          <LineChart
            width={500}
            height={300}
            data={newVisits}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            className="chart"
          >
            <Line type="monotone" dataKey="uv" stroke="#00d7d2" />
            {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
             */}
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-40}
            ></XAxis>
            <YAxis>
              <Label
                value="Number of Visits"
                angle={-90}
                position="outside"
                fontSize={14}
                fill="#676767"
              />
            </YAxis>
            <Tooltip content={<CustomTooltip1 />} />
          </LineChart>
          <LineChart
            width={500}
            height={300}
            data={newPosts}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            className="chart"
          >
            <Line type="monotone" dataKey="uv" stroke="#00d7d2" />
            {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
             */}
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-40}
            ></XAxis>
            <YAxis>
              <Label
                value="Number of Posts"
                angle={-90}
                position="outside"
                fontSize={14}
                fill="#676767"
              />
            </YAxis>
            <Tooltip content={<CustomTooltip2 />} />
          </LineChart>
          <BarChart
            width={500}
            height={300}
            data={[
              {
                name: "Report stats",
                Reports: num_reports,
                Resolved: num_resolved,
              },
            ]}
            className="chart"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Reports" fill="#00d7d2" />
            <Bar dataKey="Resolved" fill="#00846c" />
          </BarChart>
          <br />
          <br />
        </div>
      </div>
      <br></br>
      <br></br>
    </>
  );
};

export default Prof;
