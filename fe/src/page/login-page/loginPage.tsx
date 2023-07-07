import React from "react";
import { Button, Divider, Form, Input, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  GoogleOutlined,
  FacebookFilled,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import "./loginPage.scss";

import RouterLinks from "../../const/router_link";
const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <Form className="login">
        <Typography.Title>Chat app</Typography.Title>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên đăng nhập!",
            },
          ]}
          label=""
          name={"username"}
        >
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
          name={"password"}
        >
          <Input.Password
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            placeholder="Mật khẩu"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
        <span>Bạn chưa có tài khoản.</span>
        <Link to={RouterLinks.REGISTER_PAGE}>Đăng ký?</Link>
        <Divider style={{ borderBlock: "black" }}>Or login with </Divider>
        <div className="socialLogin">
          <GoogleOutlined style={{ color: "red", cursor: "pointer" }} />
          <FacebookFilled style={{ color: "#1876F2", cursor: "pointer" }} />
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
