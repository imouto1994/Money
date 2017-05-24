import { fork, all } from "redux-saga/effects";

import { watchRoutes } from "./RouterSagas";
import Routes from "../routes";

export default function createRootSaga(history) {
  return function* rootSaga() {
    yield all([
      fork(watchRoutes, Routes, history),
    ]);
  };
}
