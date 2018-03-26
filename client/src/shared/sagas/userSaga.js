import { put } from "redux-saga/effects";
import * as types from "../actionTypes";

export function* changeEmail({ email }) {
  try {
    yield put({ type: types.EMAIL_CHANGED, email });
  } catch (error) { }
}

export function* changePassword({ password }) {
  try {
    yield put({ type: types.PASSWORD_CHANGED, password });
  } catch (error) { }
}
