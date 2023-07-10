import React, { useEffect, useRef, useState } from "react";
import { Input, Tooltip } from "antd";
import { faPaperPlane, faFaceSmile, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import useAction from "../../../../redux/useActions";

import "./InputChat.scss";
// const socket = io(serverConfig.server);
const InputChat: React.FC<any> = ({ socket }) => {
  const actions = useAction();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const conversation = useSelector((state: any) => state.auth.conversation);
  const userSelected = useSelector((state: any) => state.auth.userSelected);
  const [message, setMessage] = useState();
  const handleChangeInput = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = () => {
    socket.current.emit("send_message", {
      conversation_id: conversation?._id,
      to: userInfo?._id,
      from: userSelected?._id,
      message: message,
      type: "Text",
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
