import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "../../../components/Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Badge } from "antd";
import InputChat from "./InputChat/InputChat";
import useAction from "../../../redux/useActions";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../../context/appContext";
import * as uuid from "uuid";
import "./ChatContainer.scss";
const ChatContainer: React.FC<any> = ({ handleBackListFriend, isMobile }) => {
  const { socket, messages, setMessages } = useContext(AppContext);
  const dispatch = useDispatch();
  const actions = useAction();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  // const conversation = useSelector((state: any) => state.auth.conversation);
  // const [messages, setMessages] = useState<any>(conversation.messages);
  const userSelected = useSelector((state: any) => state.auth.userSelected);
  const messageEndRef = useRef<any>(null);
  socket.off("new_message").on("new_message", function (data: any) {
    // setMessages([...messages, data.message]);
    setMessages([...messages, data.message]);
  });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="chat-container">
      <div className="header-chat">
        <div className="user-conversation">
          {isMobile ? (
            <div className="icon-arrow-back" onClick={handleBackListFriend}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          ) : (
            ""
          )}
          <Badge className="badge">
            {/* <Avatar size={35} /> */}

            <Avatar
              style={{ backgroundColor: "rgba(148, 146, 146, 0.116)" }}
              src={userSelected?.avatarImage}
              size={35}
            >
              {userSelected.displayName ? userSelected.displayName.charAt(0).toUpperCase() : "A"}{" "}
            </Avatar>
            <span
              className={`status ${
                userSelected?.status === "Online" ? "status-online" : "status-offline"
              }`}
            />
          </Badge>
          <div className="text-status">
            <div style={{ fontSize: "0.7rem", fontWeight: 550 }}>{userSelected?.displayName}</div>
            <div
              style={{
                fontSize: "0.6rem",
                // color: "rgba(0, 0, 0, 0.473)",
                color: "white",
              }}
            >
              {" "}
              {userSelected?.status}
            </div>
          </div>
        </div>
        <div className="other-method-conversation">
          <FontAwesomeIcon icon={faPhone} className="icon-method-conversation" />
          <FontAwesomeIcon icon={faVideo} className="icon-method-conversation" />
        </div>
      </div>
      <div className="chat-message">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message: any) => {
            return (
              <Message
                key={uuid.v4()}
                content={message?.text}
                position={message?.to === userInfo?._id ? `sended` : `recieved`}
              />
            );
          })
        ) : (
          <h4>{`Hãy gửi lời chào đến ${userSelected?.displayName}`}</h4>
        )}
        <div ref={messageEndRef}></div>
        {/* <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" /> */}
      </div>
      <InputChat socket={socket} />
    </div>
  );
};

export default ChatContainer;
