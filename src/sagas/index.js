import { call, all } from "redux-saga/effects";

import { watchRoutes } from "./RouteSagas";
import { watchErrors } from "./ErrorSagas";
import { Routes } from "../routes";
import { BROWSER } from "../Config";

export default function createRootSaga(history) {
  return function* rootSaga() {
    yield all([
      call(watchRoutes, Routes, history),
      // Only watch errors for client side. Errors will be handled in the middlewares for server side
      ...(BROWSER ? [call(watchErrors)] : []),
    ]);
  };
}
