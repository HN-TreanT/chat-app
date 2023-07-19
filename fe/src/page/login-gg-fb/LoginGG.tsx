import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authServices } from "../../utils/services/authService";
import { useNavigate } from "react-router-dom";
import RouterLinks from "../../const/router_link";
import { AppContext } from "../../context/appContext";
import { useSelector, useDispatch } from "react-redux";
import useAction from "../../redux/useActions";
const LoginGG: React.FC<any> = () => {
  const { socket } = useContext(AppContext);
  const { email, tokenLogin } = useParams();
  const navigate = useNavigate();
  const actions = useAction();
  const dispatch = useDispatch();
  useEffect(() => {
    async function handlLoginWithGGorFB() {
      try {
        const message = await authServices.loginwithGGorFB({
          email: email,
          tokenLogin: tokenLogin,
        });
        if (message.status) {
          socket.io.opts.query = { username: message?.data?.username };
          socket.disconnect();
          socket.connect();
          localStorage.setItem("username", message?.data?.username);
          dispatch(actions.AuthActions.setuserInfo(message.data));
          dispatch(actions.StateAction.loginState(true));
          navigate(RouterLinks.HOME_PAGE);
        } else {
          return navigate(RouterLinks.LOGIN_PAGE);
        }
      } catch (err: any) {
        console.log(err);
      }
    }
    handlLoginWithGGorFB();
  }, [actions.AuthActions, actions.StateAction, dispatch, email, navigate, socket, tokenLogin]);
  return <div>login gg fb</div>;
};
export default LoginGG;
