import React from "react";
import Message from "../../../components/Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Badge } from "antd";
import InputChat from "./InputChat/InputChat";
import "./ChatContainer.scss";
const ChatContainer: React.FC = () => {
  return (
    <div className="chat-container">
      <div className="header-chat">
        <div className="user-conversation">
          <Badge className="badge">
            <Avatar size={35} />
            <span className="status" />
          </Badge>
          <div className="text-status">
            <div style={{ fontSize: "0.7rem", fontWeight: 550 }}>Nguyễn Hoàng Nam</div>
            <div style={{ fontSize: "0.6rem", color: "rgba(0, 0, 0, 0.473)" }}>Đang hoạt động</div>
          </div>
        </div>
        <div className="other-method-conversation">
          <FontAwesomeIcon icon={faPhone} className="icon-method-conversation" />
          <FontAwesomeIcon icon={faVideo} className="icon-method-conversation" />
        </div>
      </div>
      <div className="chat-message">
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
        <Message position="recieved" />
        <Message position="sended" />
        <Message position="sended" />
        <Message position="recieved" />
      </div>
      <InputChat />
    </div>
  );
};

export default ChatContainer;
