import { all } from "redux-saga/effects";

import authSaga from "./auth/saga";
import stateSaga from "./state/saga";
import friendSaga from "./requestFriendly/saga";

export default function* rootSaga() {
  yield all([authSaga(), stateSaga(), friendSaga()]);
}
