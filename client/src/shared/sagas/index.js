//fork is an effect creator that provisions the middleware to run a non-blocking call on watchSearchMedia saga.
import { fork } from "redux-saga/effects";
import watchUser from "./watcher";

// Here, we register our watcher saga(s) and export as a single generator
// function (startForeman) as our root Saga.
export default function* startForman() {
  //Here, we can bundle our watcher sagas as an array and yield them at once if we have more than one.
  yield fork(watchUser);
}
