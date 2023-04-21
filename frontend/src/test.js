import axios from "axios";
import { useState } from "react";
import { API_URL } from "./API_URL";
async function getData() {
  // console.log("i process");
  //   const headers = {
  //     Authorization:
  //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2NmYmMzOGVhMGQ3YTUzZTYwNjc2YjciLCJ1c2VyX25hbWUiOiJjajI2MyIsImlhdCI6MTY3NDU2ODg5MSwiZXhwIjoxNjc3MTYwODkxfQ.zRx50l8ypmoQ3mFEgoB7_VQDAFfuXW3JPS3VXyCwHTc",
  //     //   "My-Custom-Header": "foobar",
  //   };
  //   const [data, setData] = useState({});
  let data = {};
  try {
    const headers = {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2NmYmMzOGVhMGQ3YTUzZTYwNjc2YjciLCJ1c2VyX25hbWUiOiJjajI2MyIsImlhdCI6MTY3NDU2ODg5MSwiZXhwIjoxNjc3MTYwODkxfQ.zRx50l8ypmoQ3mFEgoB7_VQDAFfuXW3JPS3VXyCwHTc",
    };
    const resp = await axios.get(API_URL + "/user/rj321", { headers });
    data = resp.data;
  } catch (err) {
    console.log(err);
  }
  // console.log(data);
  //   console.log(response.data);
}

export default getData;
