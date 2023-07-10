import React, { useEffect, useState } from "react";
import Message from "../../../components/Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Badge } from "antd";
import InputChat from "./InputChat/InputChat";
import useAction from "../../../redux/useActions";
import { useDispatch, useSelector } from "react-redux";
import * as uuid from "uuid";
import "./ChatContainer.scss";
const ChatContainer: React.FC<any> = ({ handleBackListFriend, isMobile, socket }) => {
  const dispatch = useDispatch();
  const actions = useAction();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const conversation = useSelector((state: any) => state.auth.conversation);
  const [messages, setMessages] = useState(conversation.messages);
  const userSelected = useSelector((state: any) => state.auth.userSelected);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("new_message", function (data: any) {
        conversation.messages.push(data.message);
        console.log(conversation);
        dispatch(actions.AuthActions.setConversation(conversation));
      });
    }
  }, [actions.AuthActions, conversation, conversation.messages, dispatch, socket]);

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

            <Avatar src={userSelected?.avatarImage} size={35}>
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
                color: "rgba(0, 0, 0, 0.473)",
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
        <Message position="sended" />
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
