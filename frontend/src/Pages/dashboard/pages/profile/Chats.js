import React, { useEffect, useState, useRef } from "react";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatonline/ChatOnline";
import "./Chats.css";
import Loader from "../../components/loader/Loader";
import axios from "axios";
import { API_URL, SOCKET_URL } from "../../../../API_URL";
// import { useFetch } from "../../useFetch";
import { io } from "socket.io-client";

const Chats = () => {
  const divRef = useRef();
  const [conversation, setConversation] = useState([]);
  const [current_chat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [inp, setInp] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const [loader, setLoader] = useState(false);
  const user = JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
    .user_name;

  const [item, setItem] = useState([]);
  useEffect(() => {
    // console.log("rendered");
    const headers = {
      authorization: `Bearer ${
        JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
      }`,
    };
    setLoader(true);
    axios
      .get(
        API_URL +
          `/user/${
            JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
              .user_name
          }`,
        { headers }
      )
      .then((resp) => {
        setItem(resp.data.User);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    socket.current = io(SOCKET_URL);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      current_chat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
    // console.log("message", arrivalMessage);
  }, [arrivalMessage, current_chat]);

  useEffect(() => {
    socket.current.emit("addUser", user);
    socket.current.on("getUsers", (users) => {
      // console.log(users);
      setOnlineUsers(
        item?.following?.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [item]);
  const headers = {
    authorization: `Bearer ${
      JSON.parse(localStorage.getItem("greddit_user_loggedin")).token
    }`,
  };

  useEffect(() => {
    axios
      .get(
        API_URL +
          `/conversation/${
            JSON.parse(localStorage.getItem("greddit_user_loggedin")).user
              .user_name
          }`,
        { headers }
      )
      .then((resp) => {
        setConversation(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (current_chat) {
      axios
        .get(API_URL + `/message/${current_chat._id}`, { headers })
        .then((resp) => {
          setMessages(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [current_chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inp === "" || !inp) return;
    const body = {
      sender: user,
      text: inp,
      conversationId: current_chat._id,
    };

    const receiverId = current_chat.members?.find((m) => m !== user);
    console.log("sendmessage", current_chat, {
      senderId: user,
      receiverId,
      text: inp,
    });
    socket.current.emit("sendMessage", {
      senderId: user,
      receiverId,
      text: inp,
    });

    axios
      .post(API_URL + `/message/`, body, { headers })
      .then((resp) => {
        setMessages([...messages, resp.data]);
        // console.log(conversation);
        setInp("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    divRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {loader && <Loader />}
      <div className="messenger" style={{ width: "80%" }}>
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {/* <input placeholder="Search for people" className="chatMenuInput" /> */}
            <span className="heading">Chats</span>
            {conversation?.map((conver) => {
              return (
                <div onClick={() => setCurrentChat(conver)} key={Math.random()}>
                  <Conversation conversation={conver} currentUser={user} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="chatBox">
          {current_chat ? (
            <div className="chatBoxWrapper">
              <span className="heading">
                {current_chat?.members?.filter((mem) => mem !== user)}
              </span>
              <div className="chatBoxTop">
                {messages?.map((message) => {
                  return (
                    <div ref={divRef} key={Math.random()}>
                      <Message
                        message={message}
                        own={message.sender === user}
                      />
                    </div>
                  );
                })}
                {messages?.length === 0 && (
                  <span className="noConversationText">No chats yet</span>
                )}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={(e) => setInp(e.target.value)}
                  value={inp}
                ></textarea>
                <button
                  className="follow_button"
                  style={{ padding: "10px", borderRadius: "5px" }}
                  onClick={sendMessage}
                >
                  Send
                </button>
                <br />
                <br />
              </div>
            </div>
          ) : (
            <span className="noConversationText">Open chat</span>
          )}
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <span className="heading">Online</span>
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user}
              setCurrentChat={setCurrentChat}
              conversation={conversation}
              setConversation={setConversation}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chats;
