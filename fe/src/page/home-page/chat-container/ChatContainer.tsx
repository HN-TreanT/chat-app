import React, { useContext, useEffect, useRef, useState } from "react";
import Message from "../../../components/Message/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faVideo, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Badge, Spin, Image } from "antd";
import InputChat from "./InputChat/InputChat";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAction from "../../../redux/useActions";
import { AppContext } from "../../../context/appContext";
import * as uuid from "uuid";
import "./ChatContainer.scss";
import { messageService } from "../../../utils/services/messageService";
import imgHello from "../../../assets/wave.png";
const ChatContainer: React.FC<any> = ({ handleBackListFriend, isMobile }) => {
  const dispatch = useDispatch();
  const actions = useAction();
  const { socket, messages, setMessages } = useContext(AppContext);
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const userSelected = useSelector((state: any) => state.auth.userSelected);
  const conversation = useSelector((state: any) => state.auth.conversation);
  const loading = useSelector((state: any) => state.state.loadingState);
  const [isScrollTop, setIsScrolltop] = useState(false);
  const [page, setPage] = useState(2);

  const messageEndRef = useRef<any>(null);

  socket.off("new_message").on("new_message", function (data: any) {
    setMessages([...messages, data.message]);
    setIsScrolltop(false);
    dispatch(actions.AuthActions.loadFriend());
    setPage(2);
  });

  useEffect(() => {
    if (!isScrollTop) {
      scrollToBottom();
    }
  }, [isScrollTop, messages]);

  useEffect(() => {
    async function getMessages() {
      try {
        if (!isScrollTop) {
          const data = await messageService.getMessages(conversation._id, 1, 40);
          setMessages(data?.data ? data.data : []);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getMessages();
  }, [conversation._id, isScrollTop, setMessages]);
  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleScroll = async (e: any) => {
    if (e.target.scrollTop === 0) {
      try {
        dispatch(actions.StateAction.loadingState(true));
        const data = await messageService.getMessages(conversation._id, page, 40);
        dispatch(actions.StateAction.loadingState(false));
        setIsScrolltop(true);
        setMessages([...data.data, ...messages]);
        setPage(page + 1);
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  socket.off("start_chat").on("start_chat", async (data: any) => {
    dispatch(actions.AuthActions.setConversation(data));
    const messages = await messageService.getMessages(data._id, 1, 40);
    setMessages(messages.data);
    setPage(2);
    scrollToBottom();
  });

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
      <div onScroll={handleScroll} className="chat-message">
        {loading ? <Spin /> : ""}
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message: any, index) => {
            let nextMessage = false;
            if (messages[index + 1]?.to !== userInfo?._id) {
              nextMessage = true;
            }
            if (messages[index + 1] === undefined) {
              nextMessage = false;
            }
            return (
              <Message
                userSelected={userSelected}
                key={uuid.v4()}
                content={`${message?.text}`}
                position={message?.to === userInfo?._id ? `sended` : `recieved`}
                nextMessage={nextMessage}
              />
            );
          })
        ) : (
          <div className="empty-message">
            <Image className="icon-hello" src={imgHello} preview={false} />
            <h4 className="title-empty-chat">{`Hãy gửi lời chào đến ${userSelected?.displayName}`}</h4>
          </div>
        )}
        <div ref={messageEndRef}></div>
      </div>
      <InputChat socket={socket} />
    </div>
  );
};

export default ChatContainer;
