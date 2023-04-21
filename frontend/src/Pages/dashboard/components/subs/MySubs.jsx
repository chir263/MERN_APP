import Post from "./Sub";
import "./feed.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../API_URL";
import React from "react";
import Alert from "@mui/material/Alert";
import Loader from "../loader/Loader";
import { useCallback, useRef } from "react";

const MySubs = React.memo(() => {
  const [postlist, setPostList] = useState([]);
  const [selectedattr, setselectedattr] = useState([]);
  const [tagtext, setTagText] = useState("");
  const [searchtext, setSearchText] = useState("");
  const [taglist, setTagList] = useState([]);
  const [pagenumber, setPageNumber] = useState({ search: false, num: 1 });
  const user = JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
    .user_name;
  const [loader, setLoader] = useState(false);
  const [init, setInit] = useState(true);
  useEffect(() => {
    if (user) {
      const headers = {
        authorization: `Bearer ${
          JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
        }`,
      };
      let body = {};
      body.tags = taglist.map((tag) => tag.trim()).join(",");
      body.sort = selectedattr.map((tag) => tag.trim()).join(",");
      body.search = searchtext;
      setLoader(true);
      let cancel;
      axios
        .post(
          API_URL +
            `/subgreddit/search?page=${pagenumber.search ? 1 : pagenumber.num}`,
          body,
          {
            headers,
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
          }
        )
        .then((resp) => {
          if (pagenumber.search) {
            setPostList([...resp.data.subgreddit]);
          } else {
            if (!init) {
              setInit(false);
              setPostList([...postlist, ...resp.data.subgreddit]);
            } else {
              setPostList([
                ...postlist,
                ...resp.data.subgreddit
                  .slice()
                  .filter((sub) => sub.createdBy === user),
                ...resp.data.subgreddit.filter((sub) => sub.createdBy !== user),
              ]);
            }
          }
          setLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
      return () => cancel();
    }
  }, [pagenumber]);

  const observer = useRef();
  const lastPost = useCallback(
    (node) => {
      if (loader) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // console.log(entries);
        if (
          entries[0].isIntersecting &&
          postlist.length >= pagenumber.num * 6
        ) {
          setPageNumber({ search: false, num: pagenumber.num + 1 });
          // console.count("change", pagenumber);
        }
        // console.count(pagenumber);
      });
      if (node) observer.current.observe(node);
      // console.log(node);
    },
    [loader]
  );

  const [alert, setAlert] = useState(false);
  const [alertmessage, setAlertMessage] = useState({
    msg: "Updated successfully",
    sev: "success",
  });
  const [attr_list, setAttrList] = useState([
    "name (a)",
    "name (d)",
    "followers",
    "createdAt",
  ]);

  const addTag = (tag) => {
    if (tagtext !== "") {
      setTagList([...taglist, tag]);
    }
  };
  const removeTag = (attr) => {
    setTagList(taglist.filter((att) => attr !== att));
  };

  const addSort = (attr) => {
    if (attr.startsWith("name")) {
      setAttrList(attr_list.filter((att) => !att.startsWith("name")));
    } else {
      setAttrList(attr_list.filter((att) => attr !== att));
    }
    setselectedattr([...selectedattr, attr]);
  };

  const removeSort = (attr) => {
    // setselectedattr(attr);
    if (attr.startsWith("name")) {
      setAttrList([...attr_list, "name (a)", "name (d)"]);
    } else {
      setAttrList([...attr_list, attr]);
    }
    setselectedattr(selectedattr.filter((att) => attr !== att));
  };

  const search = () => {
    setPageNumber({ search: true, num: 1 });
  };

  const pressEnter = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) search();
  };
  const addKeyTag = (e) => {
    e.preventDefault();
    if (e.keyCode === 13) addTag(tagtext);
  };
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
          {/* <Share /> */}

          <div style={{ backgroundColor: "#eaeaea", margin: "10px" }}>
            <input
              type="text"
              className="search_text"
              placeholder="search..."
              value={searchtext}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyUp={pressEnter}
            />
            <button className="search_button" onClick={search}>
              Search
            </button>
            <input
              type="text"
              className="tag_text"
              placeholder="tag..."
              value={tagtext}
              onChange={(e) => {
                setTagText(e.target.value);
              }}
              onKeyUp={addKeyTag}
            />
            <button className="tag_button" onClick={() => addTag(tagtext)}>
              Add tag
            </button>
            <span
              style={{
                fontSize: "20px",
                marginLeft: "10px",
                marginRight: "10px",
                color: "#6a6a6a",
              }}
            >
              sort
            </span>
            {attr_list.map((attr) => {
              return (
                <button
                  className="sort_button"
                  key={Math.random()}
                  onClick={() => addSort(attr)}
                >
                  {attr}
                </button>
              );
            })}
          </div>
          <div>
            {taglist.map((attr) => {
              return (
                <button
                  className="sort_button"
                  key={Math.random()}
                  onClick={() => removeTag(attr)}
                >
                  {attr}
                </button>
              );
            })}
          </div>
          <div>
            {selectedattr.map((attr) => {
              return (
                <button
                  className="sort_button"
                  key={Math.random()}
                  onClick={() => removeSort(attr)}
                >
                  {attr}
                </button>
              );
            })}
          </div>
          <div>
            {postlist &&
              postlist.map((p, index) => {
                if (postlist.length === index + 1) {
                  return (
                    <>
                      <Post
                        key={Math.random()}
                        sub={p}
                        setAlert={setAlert}
                        setAlertMessage={setAlertMessage}
                        // addPage={addPage}
                      />
                      <div key={Math.random()} ref={lastPost}></div>
                    </>
                  );
                } else {
                  return (
                    <Post
                      key={Math.random()}
                      sub={p}
                      setAlert={setAlert}
                      setAlertMessage={setAlertMessage}
                      // addPage={addPage}
                    />
                  );
                }
              })}
            {postlist && postlist.length === 0 && (
              <h2 style={{ color: "#848484" }}>No Subs yet</h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
});
export default MySubs;
