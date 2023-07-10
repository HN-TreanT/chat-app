import React, { useEffect, useState, useContext } from "react";
import { Input, Avatar, Row, Col, Tooltip, Modal, Button, Spin, Skeleton } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUserPlus, faPlus } from "@fortawesome/free-solid-svg-icons";
import ItemFriend from "../../../components/ItemFriend/ItemFriend";
import { authServices } from "../../../utils/services/authService";
import { useDispatch, useSelector } from "react-redux";
import useAction from "../../../redux/useActions";
import "./sidebar.scss";
import { AppContext } from "../../../context/appContext";
import { Socket } from "socket.io-client";

const Sidebar: React.FC<any> = ({ handleDetailConversation, socket }) => {
  const { socket1 } = useContext(AppContext);
  const dispatch = useDispatch();
  const actions = useAction();
  const loading = useSelector((state: any) => state.state.loadingState);
  // const socket = useRef<any>();
  const me = useSelector((state: any) => state.auth.userInfo);
  const friends = useSelector((state: any) => state.auth.listFriend);

  const [isOpenModelAddUser, setIsOpenModelAddUser] = useState(false);
  const [isOpenModelMail, setIsOpenModelMail] = useState(false);
  const [isOpenModelCreateGroup, setIsOpenModelCreateGroup] = useState(false);
  const [valueSearchEmail, setValueSearchEamil] = useState("");
  const [userWantFriendLy, setUserWantFriendly] = useState<any>();
  const [sender, setSender] = useState<any>();

  useEffect(() => {
    dispatch(actions.AuthActions.loadFriend());
  }, [dispatch, actions.AuthActions]);
  // useEffect(() => {
  //   // if (socket.current) {
  //   // socket.current.on("received_friendly_request", function (data: any) {
  //   //   if (data) {
  //   //     setIsOpenModelMail(true);
  //   //     setSender(data?.user);
  //   //   }
  //   // });
  //   socket1.on("received_friendly_request", function (data: any) {
  //     console.log(data);
  //     if (data) {
  //       setIsOpenModelMail(true);
  //       setSender(data?.user);
  //     }
  //   });
  //   // socket.current.on("user_online", function (data: any) {
  //   //   console.log(data);
  //   // });
  //   // }
  // }, [socket1]);

  // useEffect(() => {
  //   //if (socket.current) {
  //   socket.current.on("received_friendly_request", (data: any) => {
  //     console.log("check useeff", data);
  //     if (data) {
  //       setIsOpenModelMail(true);
  //       setSender(data?.user);
  //     }
  //   });
  //   //}
  // }, [socket]);
  const handleChangeInputSearchEmail = (e: any) => {
    setValueSearchEamil(e.target.value);
  };
  const handleSendRequestFriend = async () => {
    // socket.current.emit("send_friendly_request", {
    //   sender: me._id,
    //   recipient: userWantFriendLy._id,
    // });
    socket1.emit("send_friendly_request", {
      sender: me._id,
      recipient: userWantFriendLy._id,
    });
  };
  socket1.off("received_friendly_request").on("received_friendly_request", (data: any) => {
    console.log(data);
  });
  const handleClickSearch = async () => {
    try {
      dispatch(actions.StateAction.loadingState(true));
      const user = await authServices.getByEmail(valueSearchEmail);
      if (user.status) {
        setUserWantFriendly(user.data);
      } else {
        setUserWantFriendly(null);
      }
      dispatch(actions.StateAction.loadingState(false));
    } catch (err: any) {
      console.log(err);
    }
  };
  const handleAcceptRequest = () => {
    socket.current.emit("accept_friendly_request", {
      sender: sender?._id,
      recipient: me?._id,
    });
    setIsOpenModelMail(false);
  };

  return (
    <div className="sider-bar">
      <Modal
        title={`Nhập tên của nhóm`}
        footer={true}
        onCancel={() => setIsOpenModelCreateGroup(false)}
        open={isOpenModelCreateGroup}
      >
        <Input placeholder="Nhập tên của nhóm"></Input>
      </Modal>
      <Modal
        title={`Kết bạn`}
        footer={null}
        onCancel={() => {
          setIsOpenModelAddUser(false);
          setValueSearchEamil("");
          setUserWantFriendly(null);
        }}
        open={isOpenModelAddUser}
        width={300}
      >
        <div className="modal-add-user">
          <Input
            placeholder="Nhập email để tìm kiếm"
            value={valueSearchEmail}
            prefix={
              <FontAwesomeIcon
                onClick={handleClickSearch}
                className="icon-search"
                icon={faMagnifyingGlass}
              />
            }
            onChange={handleChangeInputSearchEmail}
          ></Input>
          <div className="user-search">
            {/* <Spin /> */}
            {loading ? (
              <Spin size="small" />
            ) : (
              <>
                {userWantFriendLy ? (
                  <>
                    <div>
                      <Avatar src={userWantFriendLy?.avatarImage} size={33}>
                        {userWantFriendLy?.displayName
                          ? userWantFriendLy?.displayName.charAt(0).toUpperCase()
                          : "A"}{" "}
                      </Avatar>
                      <span style={{ fontSize: "0.8rem", fontWeight: 550 }}>
                        {" "}
                        {userWantFriendLy?.displayName}
                      </span>
                    </div>
                    <Button onClick={handleSendRequestFriend} size="small" type="primary">
                      Kết bạn
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        open={isOpenModelMail}
        title="Lời mời kết bạn"
        onCancel={() => setIsOpenModelMail(false)}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsOpenModelMail(false);
            }}
            danger
          >
            Hủy
          </Button>,
          <Button type="primary" onClick={handleAcceptRequest}>
            Đồng ý
          </Button>,
        ]}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={sender?.avatarImage} size={33}>
            {sender?.displayName ? sender?.displayName.charAt(0).toUpperCase() : "A"}{" "}
          </Avatar>
          <div style={{ paddingLeft: "5px" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 550 }}> {sender?.displayName}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 550 }}>{sender?.email}</div>
          </div>
        </div>
      </Modal>

      <div className="header-sider-bar">
        <Row gutter={[10, 10]}>
          <Col span={24}>
            <div className="info-me">
              <div className="title">Chat</div>
              <div className="other-function">
                <Button onClick={() => setIsOpenModelCreateGroup(true)} size="small" type="primary">
                  <FontAwesomeIcon icon={faPlus} style={{ paddingRight: "5px" }} />
                  Tạo nhóm
                </Button>
                <Tooltip
                  placement="top"
                  title="Thêm bạn bè"
                  overlayInnerStyle={{ fontSize: "0.7rem" }}
                  style={{ fontSize: "0.5rem" }}
                >
                  {" "}
                  <FontAwesomeIcon
                    onClick={() => setIsOpenModelAddUser(true)}
                    icon={faUserPlus}
                    className="icon-footer-sidebar"
                  />
                </Tooltip>
              </div>
            </div>
            <Input
              placeholder="Tìm kiếm bạn bè"
              prefix={<FontAwesomeIcon className="icon-search" icon={faMagnifyingGlass} />}
              className="input-search"
            ></Input>
          </Col>
          <Col span={24}></Col>
        </Row>
      </div>
      <div className="list-friend">
        {Array.isArray(friends)
          ? friends.map((friend: any) => {
              return (
                <ItemFriend
                  key={friend?._id}
                  friend={friend}
                  handleDetailConversation={handleDetailConversation}
                />
              );
            })
          : ""}
        <Skeleton avatar paragraph={{ rows: 0 }} loading active={true} />
      </div>
      <div className="footer-sidebar">
        <div>
          <Avatar src={me?.avatarImage} size={33}>
            {me?.displayName ? me?.displayName.charAt(0).toUpperCase() : "A"}{" "}
          </Avatar>
          <span style={{ fontSize: "0.6rem", fontWeight: 550, marginLeft: "7px" }}>
            {me?.displayName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
