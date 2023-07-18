import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../../context/appContext";
import { useSelector } from "react-redux";
import Peer from "simple-peer";
import "./VideoCall.scss";
import { Button, Row, Col, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophoneSlash,
  faMicrophone,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
const RoomPage: React.FC<any> = () => {
  const me = useSelector((state: any) => state.auth.userInfo);
  const userSelected = useSelector((state: any) => state.auth.userSelected);
  const [isOpenCamera, setIsOpenCamera] = useState(true);
  const [isOpenMic, setIsOpenMic] = useState(true);
  const [stream, setStream] = useState<any>();
  const [receivingCall, setReceivingCall] = useState<any>(false);
  const [caller, setCaller] = useState<any>("");
  const [callerSignal, setCallerSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<any>(false);
  const [colSpan, setColSpan] = useState<any>(12);
  const { socket } = useContext(AppContext);
  const userVideo = useRef<any>();
  const partnerVideo = useRef<any>();
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }

      //how to call
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: "stun:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "0971259398",
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "0971259398",
            },
          ],
        },
        stream: stream,
      });
      peer.on("signal", (data) => {
        socket.emit("callUser", { userToCall: userSelected._id, signal: data, userCall: me._id });
      });
      peer.on("stream", (stream) => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream;
        }
      });
      socket.on("callAccepted", (signal: any) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
    });

    /////calll
  }, [me._id, socket, userSelected._id]);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setColSpan(24);
    }
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setColSpan(24);
      } else {
        setColSpan(12);
      }
    };
    window.addEventListener("resize", handleResize);
    // Xóa event listener khi component bị hủy
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //socket
  socket.off("hey").on("hey", (data: any) => {
    setReceivingCall(true);
    setCaller(data.from);
    setCallerSignal(data.signal);
  });

  // function callPeer() {
  //   setStream(stream);
  //   if (userVideo.current) {
  //     userVideo.current.srcObject = stream;
  //   }

  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     config: {
  //       iceServers: [
  //         {
  //           urls: "stun:numb.viagenie.ca",
  //           username: "sultan1640@gmail.com",
  //           credential: "0971259398",
  //         },
  //         {
  //           urls: "turn:numb.viagenie.ca",
  //           username: "sultan1640@gmail.com",
  //           credential: "0971259398",
  //         },
  //       ],
  //     },
  //     stream: stream,
  //   });
  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", { userToCall: userSelected._id, signal: data, userCall: me._id });
  //   });
  //   peer.on("stream", (stream) => {
  //     if (partnerVideo.current) {
  //       partnerVideo.current.srcObject = stream;
  //     }
  //   });
  //   socket.on("callAccepted", (signal: any) => {
  //     setCallAccepted(true);
  //     peer.signal(signal);
  //   });
  // }

  function accpeptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
  }

  const handleCameraSlash = () => {
    setIsOpenCamera(!isOpenCamera);
  };
  const handleMicSlash = () => {
    setIsOpenMic(!isOpenMic);
  };
  /// css user video and partnet video
  let UserVideo;
  if (stream) {
    UserVideo = isOpenCamera ? (
      <video playsInline muted={isOpenMic} ref={userVideo} autoPlay />
    ) : (
      ""
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = <video playsInline ref={partnerVideo} autoPlay />;
  }
  // PartnerVideo = <video playsInline ref={userVideo} autoPlay />;

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={accpeptCall}>Accept</button>
      </div>
    );
  }
  return (
    <div>
      {/* <button onClick={callPeer}>connect</button> */}
      <div>{incomingCall} handleDetailConversation</div>
      <div className="video-call">
        <div className="container">
          <div className="content">
            <Row gutter={[10, 10]}>
              <Col span={colSpan}>
                <div className="user-video">
                  {UserVideo}
                  {/* <video playsInline muted={isOpenMic} ref={userVideo} autoPlay /> */}
                </div>
              </Col>
              <Col span={colSpan}>
                <div className="partner-video">
                  {PartnerVideo}
                  {/* <video playsInline ref={userVideo} autoPlay />; */}
                </div>
              </Col>
            </Row>
            <Col span={24}>
              <div className="button-control">
                <Tooltip title={`${isOpenCamera ? "Tắt camera" : "Bật camera"}`}>
                  <FontAwesomeIcon
                    onClick={handleCameraSlash}
                    className={`icon-control ${isOpenCamera ? "camera" : ""}`}
                    icon={isOpenCamera ? faVideo : faVideoSlash}
                  />
                </Tooltip>
                <Tooltip title={`${isOpenMic ? "Bật mic" : "Tắt mic"}`}>
                  <FontAwesomeIcon
                    onClick={handleMicSlash}
                    className={`icon-control ${isOpenMic ? "mic" : ""}`}
                    icon={isOpenMic ? faMicrophone : faMicrophoneSlash}
                  />
                </Tooltip>
                <Tooltip title="Kết thúc cuộc gọi">
                  <FontAwesomeIcon
                    className="icon-control"
                    style={{ backgroundColor: "red", color: "white" }}
                    icon={faPhone}
                  />
                </Tooltip>
              </div>
            </Col>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
