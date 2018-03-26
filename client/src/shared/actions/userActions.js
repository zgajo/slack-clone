import * as types from "../actionTypes";

export const emailChanged = email => ({
  type: types.EMAIL_CHANGED,
  email
});

export const changeEmail = email => ({
  type: types.CHANGE_EMAIL,
  email
});

export const changePassword = password => ({
  type: types.CHANGE_PASSWORD,
  password
});
export const passwordChanged = password => ({
  type: types.PASSWORD_CHANGED,
  password
});
