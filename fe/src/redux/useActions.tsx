import { AuthActions } from "./auth/actions";
import { StateAction } from "./state/actions";
import { friendActions } from "./requestFriendly/actions";
const useAction = () => {
  const actions = { AuthActions, StateAction, friendActions };
  return actions;
};
export default useAction;
