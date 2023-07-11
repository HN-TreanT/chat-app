import React from "react";
import "./ItemFriend.scss";
import { Avatar, Badge } from "antd";
const ItemFriend: React.FC<any> = ({ friend, handleDetailConversation }) => {
  const maxLength = 40; // Số ký tự tối đa trước khi hiển thị dấu chấm elipsis

  const truncateText = (text: any) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + ".......";
  };

  return (
    <div onClick={() => handleDetailConversation(friend)} className="item-friend">
      <Badge className="badge">
        {/* <Avatar size={35} /> */}
        <Avatar style={{ backgroundColor: "rgba(148, 146, 146, 0.116)" }} size={35}>
          {friend.displayName ? friend.displayName.charAt(0).toUpperCase() : "A"}{" "}
        </Avatar>
        <span
          className={`status ${friend?.status === "Online" ? "status-online" : "status-offline"}`}
          // className={`status status-online`}
        />
      </Badge>
      <div className="text-status">
        <div style={{ fontSize: "0.7rem", fontWeight: 550 }}>{friend?.displayName}</div>
        <div
          style={{
            fontSize: "0.7rem",
            color: "rgba(255, 255, 255, 0.466)",
          }}
        >
          {" "}
          {truncateText(
            " Bạn:fbeyfgweuff7yuh323hrjnfejfyef298y28fefnefn2f829ey283y8y38fy83fyfefejfheufefufheufheufh"
          )}
        </div>
      </div>
    </div>
  );
};
export default ItemFriend;
