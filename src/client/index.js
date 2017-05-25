// Polyfill before requiring other files
import "./polyfill";

/* eslint-disable import/first */
import React from "react";
import ReactDOM from "react-dom";
import createBrowserHistory from "history/createBrowserHistory";
/* eslint-enable import/first */

import Root from "../components/Root";
import { rehydrate } from "../reducers";
import configureStore from "../redux";
import createRootSaga from "../sagas";
import { changeComponent } from "../actions/RouteActions";
import { getRequireComponent } from "../routes";

const store = configureStore(rehydrate(window.__data));
const history = createBrowserHistory();
store.runSaga(createRootSaga(history));
getRequireComponent(store.getState().Route.get("name"))()
  .then(Component => {
    store.dispatch(changeComponent(Component));
    ReactDOM.render(
      <Root store={ store } />,
      document.getElementById("root"),
    );
  });
