import { call, all } from "redux-saga/effects";

import { watchRoutes } from "./RouteSagas";
import { Routes } from "../routes";

export default function createRootSaga(history) {
  return function* rootSaga() {
    yield all([
      call(watchRoutes, Routes, history),
    ]);
  };
}
