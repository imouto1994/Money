// Polyfill ES6 features before requiring other files
import "./polyfill";

import React from "react";
import ReactDOM from "react-dom";
import createBrowserHistory from "history/createBrowserHistory";
import request from "superagent";
import get from "lodash/get";
import Fetchr from "fetchr";

import Root from "../components/Root";
import { rehydrate } from "../reducers";
import configureStore from "../redux";
import createRootSaga from "../sagas";
import { changeComponent } from "../actions/RouteActions";
import { getRouteComponent } from "../routes";
import { loadIntlPolyfill, loadLocaleData } from "../utils/intl";

// Read data from DOM
const mountNode = document.getElementById("root");
const dehydratedState = window.__data;
const csrfToken = window._csrf;
const locale = document.documentElement.getAttribute("lang");
const localeFile = document.documentElement.getAttribute("data-lang-file");

/**
 * Render using React to a DOM element
 * @param {Element} node - DOM element to be mounted
 * @param {ReduxStore} store - redux store
 * @param {Object} messages - translation messages map
 */
function render(node, store, messages) {
  ReactDOM.render(
    <Root store={store} locale={locale} messages={messages} />,
    node
  );
}

// Polyfill `intl`
loadIntlPolyfill(locale)
  // Load locale data if necessary
  .then(() => loadLocaleData(locale))
  // Fetch translation file
  .then(() => request.get(localeFile))
  // Extract translations
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
    const RouteComponent = getRouteComponent(
      store.getState().Route.get("name")
    );
    store.dispatch(changeComponent(RouteComponent));
    render(mountNode, store, messages);

    // Enable Webpack hot module replacement for React component
    // TODO: Hot reload does not seem to work with code splitting
    if (process.env.NODE_ENV === "development") {
      if (module.hot) {
        module.hot.accept("./index", () => render(mountNode, store, messages));
      }
    }
  });
