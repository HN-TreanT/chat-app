import React, { useContext, useEffect, useRef, useState } from "react";
import { Row, Col } from "antd";
import Sidebar from "./sidebar/sidebar";
import ChatContainer from "./chat-container/ChatContainer";
import "./HomePage.scss";
import { useSelector, useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
import { AppContext } from "../../context/appContext";
const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const actions = useAction();
  const [colSpan, setColSpan] = useState(window.innerWidth < 768 ? 24 : 6);
  const [spanConversation, setSpanConversation] = useState(18);
  const me = useSelector((state: any) => state.auth.userInfo);
  const { socket, messages, setMessages } = useContext(AppContext);
  useEffect(() => {
    socket.io.opts.query = { username: me?.username };
    socket.disconnect();
    socket.connect();
  }, [me?.username, socket]);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColSpan(24);
      } else {
        setColSpan(6);
        setSpanConversation(18);
      }
    };
    // Gọi hàm handleResize khi kích thước màn hình thay đổi
    window.addEventListener("resize", handleResize);
    // Xóa event listener khi component bị hủy
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleBackListFriend = () => {
    setColSpan(24);
    setSpanConversation(18);
  };
  const handleDetailConversation = (e: any) => {
    if (window.innerWidth < 768) {
      setColSpan(0);
      setSpanConversation(24);
    }
    socket.emit("start_conversation", {
      to: me._id,
      from: e._id,
    });
    dispatch(actions.AuthActions.setUserSelected(e));
  };
  socket.off("start_chat").on("start_chat", (data: any) => {
    dispatch(actions.AuthActions.setConversation(data));
    setMessages(data.messages);
  });
  return (
    <div className="home-page">
      <Row gutter={[0, 0]}>
        <Col span={colSpan}>
          <Sidebar handleDetailConversation={handleDetailConversation} socket={socket} />
        </Col>
        {/* <Col span={2}>
          <Sidebar />
        </Col> */}
        <Col span={spanConversation}>
          <ChatContainer
            handleBackListFriend={handleBackListFriend}
            isMobile={window.innerWidth < 768}
            socket={socket}
          />
        </Col>
      </Row>
    </div>
  );
};
export default HomePage;
