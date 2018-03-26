import initialState from "./initialState";
import * as types from "../actionTypes";

export default function(state = initialState, action) {
  switch (action.type) {
    case types.EMAIL_CHANGED:
      return { ...state, email: action.email };
    case types.PASSWORD_CHANGED:
      return { ...state, password: action.password };
    default:
      return state;
  }
}
