import { put } from "redux-saga/effects";
import * as types from "../actionTypes";

export function* changeEmail({ email }) {
  try {
    email = email + " Darko";
    yield put({ type: types.EMAIL_CHANGED, email });
  } catch (error) {}
}

export function* changePassword({ password }) {
  try {
    password = password + " Darko";
    yield put({ type: types.PASSWORD_CHANGED, password });
  } catch (error) {}
}
