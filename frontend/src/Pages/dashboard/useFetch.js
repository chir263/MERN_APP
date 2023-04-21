import React, { useState, useEffect } from "react";
import axios from "axios";
export const useFetch = (url) => {
  const [item, setItem] = useState([]);
  const getItems = async () => {
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    const resp = await axios.get(url, { headers });
    setItem(resp.data);
  };

  useEffect(() => {
    getItems();
  }, [url]);
  return item;
};
