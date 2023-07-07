import { io } from "socket.io-client";
import { serverConfig } from "../../const";
const types = {
  IS_lOGIN: "state/is_login",
  IS_LOADING: "state/is_loading",
  IS_SELECTED_MENU_ITEM: "state/is_selected_menu_item",
  KEYS_OPEN: "state/keys_open",
  SET_NAVIGATE: "/set-navigate",
  REDIRECT_ACTION: "/redirect-action",
  INIT_SOCKET: "/init-socket",
};

const action = {
  loadingState(isLoading: boolean) {
    return {
      type: types.IS_LOADING,
      payload: { isLoading },
    };
  },
  loginState(isLogin: boolean) {
    return {
      type: types.IS_lOGIN,
      payload: { isLogin },
    };
  },
  selectedMenuItem(isSelected: any) {
    return {
      type: types.IS_SELECTED_MENU_ITEM,
      payload: { isSelected },
    };
  },
  keysOpen(keys: any) {
    return {
      type: types.KEYS_OPEN,
      payload: { keys },
    };
  },
  redirect: (data: any) => {
    return {
      type: types.SET_NAVIGATE,
      payload: { data },
    };
  },
  redirectAction: () => {
    return {
      type: types.REDIRECT_ACTION,
    };
  },
  initSocket: () => {
    return {
      type: types.INIT_SOCKET,
      payload: { socket: io(serverConfig.server) },
    };
  },
};
const actions = {
  types,
  action,
};
export default actions;
export const StateAction = action;
