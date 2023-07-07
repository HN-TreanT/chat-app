import React, { useEffect, useRef, useState } from "react";
import { Input, Tooltip } from "antd";
import { faPaperPlane, faFaceSmile, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import useAction from "../../../../redux/useActions";
// import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { serverConfig } from "../../../../const";
import "./InputChat.scss";
const socket = io(serverConfig.socketServer);
const InputChat: React.FC = () => {
  // const actions = useAction();
  // const dispatch = useDispatch()
  // console.log(socket);
  // useEffect(() => {
  //   socket.emit("send");
  // }, []);
  // socket.emit("send");
  const [message, setMessage] = useState();
  const handleChangeInput = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = () => {
    console.log(message);
    socket.emit("send", {
      message: message,
    });
  };
  return (
    <div className="input-chat">
      <Tooltip
        placement="top"
        title="Đính kèm file"
        overlayInnerStyle={{ fontSize: "0.7rem" }}
        style={{ fontSize: "0.5rem" }}
      >
        <FontAwesomeIcon className="icon" icon={faImage} />
      </Tooltip>
      <input
        onChange={handleChangeInput}
        type="text"
        placeholder="Nhập nội dung"
        className="input"
      />

      <Tooltip
        placement="top"
        title="Chọn biểu tượng cảm xúc"
        overlayInnerStyle={{ fontSize: "0.7rem" }}
        style={{ fontSize: "0.5rem" }}
      >
        <FontAwesomeIcon className="icon" icon={faFaceSmile} />
      </Tooltip>
      <Tooltip
        placement="top"
        title="Nhấn Enter để gửi"
        overlayInnerStyle={{ fontSize: "0.7rem" }}
        style={{ fontSize: "0.5rem" }}
      >
        <FontAwesomeIcon onClick={handleSendMessage} className="icon" icon={faPaperPlane} />
      </Tooltip>
    </div>
  );
};

export default InputChat;
