// Polyfill before requiring other files
import "./polyfill";

/* eslint-disable import/first */
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import createBrowserHistory from "history/createBrowserHistory";
/* eslint-enable import/first */

import Root from "../components/Root";
import { rehydrate } from "../reducers";
import configureStore from "../redux";
import createRootSaga from "../sagas";
import { changeComponent } from "../actions/RouteActions";
import { getRouteComponent } from "../routes";
import { NODE_ENV } from "../Config";

// Read data from DOM
const mountNode = document.getElementById("root");
const dehydratedState = window.__data;
const locale = document.documentElement.getAttribute("lang");
const localeFile = document.documentElement.getAttribute("data-lang-file");

/**
 * [render description]
 * @param {[type]} store [description]
 * @param {[type]} node [description]
 * @return {[type]} [description]
 */
function render(store, node) {
  ReactDOM.render(
    <AppContainer>
      <Root store={ store } />
    </AppContainer>,
    node
  );
}

// Initialize Redux
const store = configureStore(rehydrate(window.__data));
const history = createBrowserHistory();
store.runSaga(createRootSaga(history));

// Fetch the necessary chunk for the route
const RouteComponent = getRouteComponent(store.getState().Route.get("name"));
store.dispatch(changeComponent(RouteComponent));
render(store, mountNode);

// Enable Webpack hot module replacement for React component
// TODO: Hot reload does not seem to work with code splitting
if (NODE_ENV === "development") {
  if (module.hot) {
    module.hot.accept("./index", () => render(store, mountNode));
  }
}
