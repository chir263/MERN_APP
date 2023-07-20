import MySubGredditCard from "./MySubGredditCard";
import Share from "./CreateSub";
import "./css/mysub.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import React from "react";
import Alert from "@mui/material/Alert";
import Loader from "../loader/Loader";

const MySubs = React.memo(() => {
  const [postlist, setPostList] = useState([]);
  const user = JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
    .user_name;
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (user) {
      const headers = {
        authorization: `Bearer ${
          JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
        }`,
      };
      setLoader(true);
      axios
        .get(API_URL + `/subgreddit/${user}`, { headers })
        .then((resp) => {
          setPostList(resp.data.subgreddit);
          setLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
    }
  }, []);
  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState({
    msg: "Updated successfully",
    sev: "success",
  });
  const removeSub = (id) => {
    const newTours = postlist.filter((tour) => tour.name !== id);
    setPostList(newTours);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 10000);
    setAlertMessage({ msg: `Deleted SubGreddit ${id}`, sev: "success" });
  };
  const addSub = (sub) => {
    setPostList([sub, ...postlist]);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 10000);
    setAlertMessage({ msg: `Created SubGreddit ${sub.name}`, sev: "success" });
  };
  const [crt, setCrt] = useState(false);

  return (
    <>
      {loader && <Loader />}
      <div className="feed">
        <div className="feedWrapper">
          {alert && (
            <Alert severity={alertmessage.sev} sx={{ mt: 3, mb: 2 }}>
              {alertmessage.msg}
            </Alert>
          )}
          <button className="up_button" onClick={() => setCrt(!crt)}>
            Create new SubGreddiit
          </button>
          {crt && (
            <>
              <br />
              <br />
              <Share
                addSub={addSub}
                setAlert={setAlert}
                setAlertMessage={setAlertMessage}
              />
            </>
          )}

          {postlist &&
            postlist.map((p) => (
              <MySubGredditCard
                key={Math.random()}
                sub={p}
                removeSub={removeSub}
              />
            ))}
          {postlist && postlist.length === 0 && (
            <h2 style={{ color: "#848484" }}>No Subs yet</h2>
          )}
        </div>
      </div>
    </>
  );
});
export default MySubs;
