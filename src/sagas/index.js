import { call, all } from "redux-saga/effects";

import { watchRoutes } from "./RouteSagas";
import { watchErrors } from "./ErrorSagas";
import { Routes } from "../routes";

/**
 * Initialize root saga to be passed to Redux
 * @param {History} history
 * @return {GeneratorFunction}
 */
export default function createRootSaga(history) {
  return function* rootSaga() {
    yield all([
      call(watchRoutes, Routes, history),
      // Only watch errors for client side. Errors will be handled in the middlewares for server side
      ...(process.env.BROWSER ? [call(watchErrors)] : []),
    ]);
  };
}
