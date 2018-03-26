import createSagaMiddleware from "redux-saga";
import { applyMiddleware, createStore, compose } from "redux";
import rootReducer from "../reducers";
import rootSaga from "../sagas";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const confStore = () => {
  const sagaMiddleware = new createSagaMiddleware();
  return {
    ...createStore(
      rootReducer,
      composeEnhancers(applyMiddleware(sagaMiddleware))
    ),
    runSaga: sagaMiddleware.run(rootSaga)
  };
};

export default confStore;
