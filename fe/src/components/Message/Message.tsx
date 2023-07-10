import React from "react";
import "./Message.scss";
const Message: React.FC<any> = ({ content, position }) => {
  return (
    <div className={`message ${position}`}>
      <div className="content">{content}</div>
    </div>
  );
};

export default Message;
