import "./rightbar.css";
import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import { API_URL } from "../../../../API_URL";

import React from "react";
import axios from "axios";
import Loader from "../loader/Loader";

const Rightbar = React.memo(({ profile, item }) => {
  const ProfileRightbar = ({ item }) => {
    const [formValues, setFormValues] = useState({
      first_name: {
        value: item.first_name,
        error: false,
      },
      last_name: {
        value: item.last_name,
        error: false,
      },
      age: {
        value: item.age,
        error: false,
      },
      contact_number: {
        value: item.contact_number,
        error: false,
      },
      followers: {
        value: item.followers,
        error: false,
      },
      following: {
        value: item.following,
        error: false,
      },
      email: {
        value: item.email,
        error: false,
      },
    });
    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "contact_number") {
        if (
          (!Number.isInteger(parseInt(value)) && value !== "") ||
          value.length > 10
        ) {
          return;
        }
      }
      if (name === "age") {
        if (
          (!Number.isInteger(parseInt(value)) && value !== "") ||
          parseInt(value) > 120
        ) {
          return;
        }
      }
      setFormValues({
        ...formValues,
        [name]: {
          ...formValues[name],
          value,
        },
      });
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
        first_name: formValues.first_name.value,
        last_name: formValues.last_name.value,
        age: formValues.age.value,
        contact_number: formValues.contact_number.value,
      };
      setLoader(true);
      axios
        .patch(
          API_URL +
            `/user/${
              JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
                .user_name
            }`,
          body,
          {
            headers: headers,
          }
        )
        .then((resp) => {
          setAlert(true);
          setAlertMessage({ msg: "Updated successfully", sev: "success" });
          setLoader(false);
          setTimeout(() => {
            setAlert(false);
          }, 10000);
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
          setLoader(false);
        });
    };

    const [alert, setAlert] = useState(false);
    const [alertmessage, setAlertMessage] = useState("Error");
    const [visFollowers, setVisFollowers] = useState(false);
    const [visFollowing, setVisFollowing] = useState(false);
    const [followers_list, setfollowers_list] = useState([]);
    const [following_list, setfollowing_list] = useState([]);

    useEffect(() => {
      setfollowers_list(formValues.followers.value);
    }, []);
    useEffect(() => {
      setfollowing_list(formValues.following.value);
    }, []);

    const removeFollower = (id) => {
      const newTours = followers_list.filter((tour) => tour !== id);
      setfollowers_list(newTours);
      setAlert(true);
      setAlertMessage({ msg: `Removed follower ${id}`, sev: "success" });
      setTimeout(() => {
        setAlert(false);
      }, 10000);
    };
    const removeFollowing = (id) => {
      const newTours = following_list.filter((tour) => tour !== id);
      setfollowing_list(newTours);
      setAlert(true);
      setAlertMessage({ msg: `Unfollowed ${id}`, sev: "success" });
      setTimeout(() => {
        setAlert(false);
      }, 10000);
    };
    return (
      <>
        {loader && <Loader />}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
        <div className="rtbarparent">
          {alert && (
            <Alert severity={alertmessage.sev} sx={{ mt: 3, mb: 2 }}>
              {alertmessage.msg}
            </Alert>
          )}
          <button
            type="button"
            className="f_button"
            onClick={() => setVisFollowers(!visFollowers)}
          >
            Followers ({formValues.followers.value && followers_list.length})
          </button>
          <br></br>
          {visFollowers && <br></br>}
          {visFollowers &&
            followers_list.map((user) => {
              return (
                <Followers
                  user={user}
                  key={Math.random()}
                  removeFollower={removeFollower}
                />
              );
            })}
          {visFollowers && <br></br>}
          <br></br>
          <button
            type="button"
            className="f_button"
            onClick={() => setVisFollowing(!visFollowing)}
          >
            Following ({formValues.following.value && following_list.length})
          </button>
          {visFollowing && <br></br>}
          {visFollowing &&
            following_list.map((user) => {
              return (
                <Followings
                  user={user}
                  key={Math.random()}
                  removeFollowing={removeFollowing}
                />
              );
            })}
          {visFollowing && <br></br>}
          <br></br>
          <h4 className="rightbarTitle">User information</h4>
          <div className="rightbarInfo">
            <form onSubmit={handleSubmit}>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">First Name:</span>

                {/* <span className="rightbarInfoValue">{item.first_name}</span> */}

                <input
                  type="text"
                  className="updateFields"
                  name="first_name"
                  value={formValues.first_name.value}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Last Name:</span>
                {/* <span className="rightbarInfoValue">{item.last_name}</span> */}
                <input
                  type="text"
                  className="updateFields"
                  name="last_name"
                  value={formValues.last_name.value}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Age:</span>
                {/* <span className="rightbarInfoValue">{item.age}</span> */}
                <input
                  type="text"
                  className="updateFields"
                  name="age"
                  value={formValues.age.value}
                  onChange={handleChange}
                ></input>
              </div>
              {item.contact_number && (
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Contact number:</span>
                  {/* <span className="rightbarInfoValue">
                    {item.contact_number}
                  </span> */}

                  <input
                    type="text"
                    className="updateFields"
                    name="contact_number"
                    value={formValues.contact_number.value}
                    onChange={handleChange}
                  ></input>
                </div>
              )}

              {item.email && (
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Email:</span>
                  <span className="rightbarInfoValue">{item.email}</span>
                </div>
              )}

              <button type="submit" className="up_button">
                Update Profile
              </button>
            </form>
          </div>
          <br></br>
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">{<ProfileRightbar item={item} />}</div>
    </div>
  );
});

const Followers = ({ user, removeFollower }) => {
  const remove = (user) => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .patch(
        API_URL + `/user/remove_user/${user}`,
        {},
        {
          headers: headers,
        }
      )
      .then((resp) => {
        removeFollower(user);
      })
      .catch((err) => {
        alert(err.response.data.msg);
      });
  };
  return (
    <div className="followers">
      <span style={{ paddingRight: "5px", paddingLeft: "5px" }}>{user}</span>
      <i
        className="fa fa-remove"
        style={{ fontSize: "18px", color: "red", margin: "10px" }}
        onClick={() => remove(user)}
      ></i>
    </div>
  );
};

const Followings = ({ user, removeFollowing }) => {
  const remove = (user) => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    axios
      .patch(
        API_URL + `/user/unfollow/${user}`,
        {},
        {
          headers: headers,
        }
      )
      .then((resp) => {
        removeFollowing(user);
      })
      .catch((err) => {
        alert(err.response.data.msg);
      });
  };
  return (
    <div className="followers">
      <span style={{ paddingRight: "5px", paddingLeft: "5px" }}>{user}</span>
      <i
        className="fa fa-remove"
        style={{ fontSize: "18px", color: "red", margin: "10px" }}
        onClick={() => remove(user)}
      ></i>
    </div>
  );
};

export default Rightbar;
