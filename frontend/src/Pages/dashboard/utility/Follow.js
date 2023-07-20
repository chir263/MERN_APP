import { API_URL } from "../../../API_URL";
import axios from "axios";

export const follow = (user, setX) => {
  const headers = {
    authorization: `Bearer ${
      JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
    }`,
  };
  axios
    .patch(
      API_URL + `/user/follow/${user}`,
      {},
      {
        headers: headers,
      }
    )
    .then((resp) => {
      setX(true);
    })
    .catch((err) => {
      console.log(err);
    });
};
