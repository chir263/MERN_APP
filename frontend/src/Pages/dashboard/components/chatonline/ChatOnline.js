import axios from "axios";
import "./chatonline.css";
import img_avatar from "../../../../media/user.png";
import { API_URL } from "../../../../API_URL";
export default function ChatOnline({
  onlineUsers,
  currentId,
  setCurrentChat,
  setConversation,
  conversation,
}) {
  const headers = {
    authorization: `Bearer ${
      JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
    }`,
  };
  const addUser = (user) => {
    axios
      .get(API_URL + `/conversation/find/${currentId}/${user}`, { headers })
      .then((resp) => {
        setCurrentChat(resp.data);
        if (!conversation?.some((con) => con.members.includes(user))) {
          setConversation([...conversation, resp.data]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="chatOnline">
      {onlineUsers?.map((o) => (
        <div
          className="chatOnlineFriend"
          key={Math.random()}
          onClick={() => addUser(o)}
        >
          <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" src={img_avatar} alt="" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o}</span>
        </div>
      ))}
    </div>
  );
}
