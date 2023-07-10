import AuthReducer from "./auth/reducer";
import StateReducer from "./state/reducer";
import FriendReducer from "./requestFriendly/reducer";
const rootReducer = {
  auth: AuthReducer,
  state: StateReducer,
  friend: FriendReducer,
};

export default rootReducer;
