import { fork, all } from "redux-saga/effects";

import { watchRoutes } from "./RouterSagas";
import Routes from "../routes";
import Config from "../Config";

let createHistory;
if (Config.BROWSER) {
  // eslint-disable-next-line global-require
  createHistory = require("history/createBrowserHistory").default;
}
else {
  // eslint-disable-next-line global-require
  createHistory = require("history/createMemoryHistory").default;
}
const history = createHistory();

export default function* root() {
  yield all([
    fork(watchRoutes, Routes, history),
  ]);
}
