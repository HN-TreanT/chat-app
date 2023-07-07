import React from "react";
import "./Message.scss";
const Message: React.FC<any> = ({ position }) => {
  return (
    <div className={`message ${position}`}>
      <div className="content">Nguyen HOang Nam lop coong nghe thong tin</div>
    </div>
  );
};

export default Message;
