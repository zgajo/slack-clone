import { takeEvery, all } from "redux-saga/effects";
import * as types from "../actionTypes";

import { changeEmail, changePassword } from "./userSaga";

export default function* watchUser() {
  yield all([
    takeEvery(types.CHANGE_EMAIL, changeEmail),
    takeEvery(types.CHANGE_PASSWORD, changePassword)
  ]);
}
