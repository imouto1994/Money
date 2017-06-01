// Polyfill before requiring other files
import "./polyfill";

/* eslint-disable import/first */
import React from "react";
import ReactDOM from "react-dom";
import createBrowserHistory from "history/createBrowserHistory";
import request from "superagent";
import get from "lodash/get";
import Fetchr from "fetchr";
/* eslint-enable import/first */

import Root from "../components/Root";
import { rehydrate } from "../reducers";
import configureStore from "../redux";
import createRootSaga from "../sagas";
import { changeComponent } from "../actions/RouteActions";
import { getRouteComponent } from "../routes";
import { loadIntlPolyfill, loadLocaleData } from "../utils/intl";
import { NODE_ENV } from "../Config";

// Read data from DOM
const mountNode = document.getElementById("root");
const dehydratedState = window.__data;
const csrfToken = window._csrf;
const locale = document.documentElement.getAttribute("lang");
const localeFile = document.documentElement.getAttribute("data-lang-file");

/**
 * [render description]
 * @param {[type]} node [description]
 * @param {[type]} store [description]
 * @param {[type]} messages [description]
 * @return {[type]} [description]
 */
function render(node, store, messages) {
  ReactDOM.render(
    <Root store={ store } locale={ locale } messages={ messages } />,
    node,
  );
}

loadIntlPolyfill(locale)
  .then(() => loadLocaleData(locale))
  .then(() => request.get(localeFile))
  .then(res => get(res, ["body", "messages"]))
  .then(messages => {
    // Initialize Fetchr Client Instance
    const fetchr = new Fetchr({
      xhrPath: "/ui/iso",
      xhrTimeout: 1000,
      context: {
        _csrf: csrfToken,
      },
    });

    // Initialize Redux
    const store = configureStore(rehydrate(dehydratedState), fetchr);
    const history = createBrowserHistory();
    store.runSaga(createRootSaga(history));

    // Fetch the necessary chunk for the route
    const RouteComponent = getRouteComponent(store.getState().Route.get("name"));
    store.dispatch(changeComponent(RouteComponent));
    render(mountNode, store, messages);

    // Enable Webpack hot module replacement for React component
    // TODO: Hot reload does not seem to work with code splitting
    if (NODE_ENV === "development") {
      if (module.hot) {
        module.hot.accept("./index", () => render(mountNode, store, messages));
      }
    }
  });
