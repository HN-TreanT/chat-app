import React from "react";
import { Row, Col } from "antd";
import Sidebar from "./sidebar/sidebar";
import ChatContainer from "./chat-container/ChatContainer";
import "./HomePage.scss";
const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Row gutter={[0, 0]}>
        <Col span={6}>
          <Sidebar />
        </Col>
        <Col span={18}>
          <ChatContainer />
        </Col>
      </Row>
    </div>
  );
};
export default HomePage;
