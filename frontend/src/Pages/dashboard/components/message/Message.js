import "./message.css";
import img_avatar from "../../../../media/user.png";

import { msToHMS } from "../time.js";

export default function Message({ message, own }) {
  //   console.log(message);
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={img_avatar} alt="" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        {msToHMS(new Date() - new Date(message.createdAt))}
      </div>
    </div>
  );
}
