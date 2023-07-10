import actions from "./actions";

const initAuth = {
  userInfo: {},
  listFriend: [],
  conversation: {},
  userSelected: {},
};
const AuthReducer = (state: any = initAuth, action: any) => {
  switch (action.type) {
    case actions.types.USER_INFO:
      return {
        ...state,
        ...{
          userInfo: action.payload.data,
        },
      };
    case actions.types.LOAD_FRIEND:
      return {
        ...state,
      };
    case actions.types.LOAD_FRIEND_SUCCESS:
      return {
        ...state,
        ...{
          listFriend: action.payload.data,
        },
      };
    case actions.types.USER_SELECTED:
      return {
        ...state,
        ...{
          userSelected: action.payload.data,
        },
      };
    case actions.types.CONVERSATION:
      return {
        ...state,
        ...{
          conversation: action.payload.data,
        },
      };
    default:
      return state;
  }
};
export default AuthReducer;
