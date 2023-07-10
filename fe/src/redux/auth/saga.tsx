import { all, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { notification } from "../../components/notification";
import stateActions from "../state/actions";
import actions from "./actions";
import { authServices } from "../../utils/services/authService";
function* handleFail(message: any) {
  yield put(stateActions.action.loadingState(false));
  notification({
    message: message,
    title: "Thông báo",
    position: "top-right",
    type: "danger",
  });
}

function* handleErr(err: any) {
  yield put(stateActions.action.loadingState(false));
  notification({
    message: err.message,
    title: "Thông báo",
    position: "top-right",
    type: "danger",
  });
}

function* saga_Redirect() {
  //action.type.
  let _navigate: Promise<any> = yield select((state: any) => state.state.navigate);
  let navigate: any = _navigate;
  if (navigate.navigate && navigate.path) {
    navigate.navigate(navigate.path);
  }
}

function* saga_loadFriends() {
  let _userInfo: Promise<any> = yield select((state: any) => state.auth.userInfo);
  let userInfo: any = _userInfo;
  yield put(stateActions.action.loadingState(true));

  let _friends: Promise<any> = yield authServices.getFriends(userInfo._id, 1, 10);
  let friends: any = _friends;
  yield put(actions.action.loadFriendSuccess(friends.data));
  yield put(stateActions.action.loadingState(false));
}

function* saga_RedirectAction() {
  yield saga_Redirect();
}
function* listen() {
  //  yield takeEvery(actions.types.LOAD_DATA, saga_loadData);
  yield takeEvery(actions.types.LOAD_FRIEND, saga_loadFriends);
}

export default function* mainSaga() {
  yield all([fork(listen)]);
}
