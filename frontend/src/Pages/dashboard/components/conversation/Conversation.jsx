import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import img_avatar from "../../../../media/user.png";
import { API_URL } from "../../../../API_URL";
export default function Conversation({
  conversation,
  currentUser,
  current_chat,
}) {
  const [user, setUser] = useState(null);
  const friendId = conversation.members.find((m) => m !== currentUser);
  return (
    <div
      className={
        conversation?.current ? "current_conversation" : "conversation"
      }
    >
      <img className="conversationImg" src={img_avatar} alt="" />
      <span className="conversationName">{friendId}</span>
    </div>
  );
}
