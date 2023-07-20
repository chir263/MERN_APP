import "./conversation.css";
import img_avatar from "../../../../media/user.png";
export default function Conversation({
  conversation,
  currentUser,
  current_chat,
}) {
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
