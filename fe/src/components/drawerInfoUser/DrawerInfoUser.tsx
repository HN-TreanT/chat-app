import React, { useEffect, useState } from "react";
import { Drawer, Row, Col, Button, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { CheckOutlined, HighlightOutlined } from "@ant-design/icons";

import "./DrawerInfoUser.scss";
import Avatar from "react-avatar-edit";

const DrawerInfoUser: React.FC<any> = ({ visible, setVisible }) => {
  const dispatch = useDispatch();
  const actions = useAction();
  const me = useSelector((state: any) => state.auth.userInfo);

  const [isOpenModalEditImage, setIsOpenModalEdit] = useState(false);
  const [displayName, setDisplayName] = useState<any>(me?.displayName);
  const [imgCrop, setImgCrop] = useState<any>(false);
  const [storeImage, setStoreImage] = useState<any>([]);

  // useEffect(() => {
  //   dispatch(actions.AuthActions.loadUserInfo());
  // }, [actions.AuthActions, dispatch]);
  const onCrop = (view: any) => {
    setImgCrop(view);
  };
  const onClose = () => {
    setImgCrop(null);
  };
  const saveImage = () => {
    setStoreImage([...storeImage, { imgCrop }]);
    setIsOpenModalEdit(false);
  };

  const profileImageShow = storeImage.map((item: any) => item.imgCrop);
  return (
    <>
      <Drawer
        extra={<FontAwesomeIcon className="icon-edit" icon={faPenToSquare} />}
        placement="left"
        onClose={() => {
          setImgCrop(null);
          setVisible(false);
          setDisplayName(me?.displayName);
        }}
        open={visible}
      >
        <div className="drawer-info-user">
          <Row gutter={[10, 10]}>
            <Col span={24}>
              <div className="header-drawer">
                <div>
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "4px solid green",
                      cursor: "pointer",
                    }}
                    src={profileImageShow?.length ? profileImageShow : me?.avatarImage}
                    alt="Preview"
                    onClick={() => setIsOpenModalEdit(true)}
                  />
                </div>
                <Typography.Paragraph
                  style={{ marginTop: "5px" }}
                  editable={{
                    icon: <HighlightOutlined />,
                    onChange: setDisplayName,
                    enterIcon: <CheckOutlined />,
                  }}
                >
                  {displayName}
                </Typography.Paragraph>
                <Typography.Paragraph copyable={{ tooltips: false }}>
                  {me?.email}
                </Typography.Paragraph>
              </div>
            </Col>

            <Col span={24}>
              {isOpenModalEditImage ? (
                <div className="edit-image-avatar">
                  <Avatar width={350} height={295} onCrop={onCrop} onClose={onClose} />
                  <Button
                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                    type="primary"
                    onClick={saveImage}
                  >
                    Lưu ảnh
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerInfoUser;
