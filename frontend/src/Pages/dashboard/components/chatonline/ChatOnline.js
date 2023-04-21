import axios from "axios";
import { useEffect, useState } from "react";
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
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState(onlineUsers);
  //   console.log(onlineFriends);
  //   const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = () => {
      setOnlineFriends(onlineUsers);
    };

    getFriends();
  }, []);

  //   useEffect(() => {
  //     setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  //   }, [friends, onlineUsers]);

  //   const handleClick = async (user) => {
  //     try {
  //       const res = await axios.get(
  //         `/conversations/find/${currentId}/${user._id}`
  //       );
  //       setCurrentChat(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  const headers = {
    authorization: `Bearer ${
      JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
    }`,
  };
  const addUser = (user) => {
    axios
      .get(API_URL + `/conversation/find/${currentId}/${user}`, { headers })
      .then((resp) => {
        // console.log(resp.data);
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
