import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import createMemoryHistory from "history/createMemoryHistory";
import { END } from "redux-saga";
import path from "path";
import { flushServerSideRequirePaths } from "react-loadable";
import qs from "qs";

import Root from "../../components/Root";
import HtmlDocument from "../../components/HtmlDocument";
import { errorSelector } from "../../selectors/ErrorSelectors";
import { dehydrate } from "../../reducers";
import configureStore from "../../redux";
import createRootSaga from "../../sagas";
import { NODE_ENV } from "../../Config";
import {
  STATUS_CODE_UNAUTHORIZED,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_PERMANENT_REDIRECT,
  STATUS_CODE_TEMP_REDIRECT,
} from "../../constants/Http";

let webpackAssets;
if (NODE_ENV === "production") {
  // eslint-disable-next-line global-require
  webpackAssets = require("./webpack-stats.json");
}

// eslint-disable-next-line no-unused-vars
function render(req, res, next) {
  if (NODE_ENV === "development") {
    // eslint-disable-next-line global-require
    webpackAssets = require("./webpack-stats.json");

    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    delete require.cache[require.resolve("./webpack-stats.json")];
  }

  // Intialize Redux
  const store = configureStore();
  const history = createMemoryHistory();
  store
    .runSaga(createRootSaga(history))
    .done
    .then(() => {
      const err = errorSelector(store.getState());
      if (err) {
        const { status = 0, statusCode = 0, redirectPath } = err;
        const isForbidden = status === STATUS_CODE_FORBIDDEN || statusCode === STATUS_CODE_FORBIDDEN;
        const isUnauthorized = status === STATUS_CODE_UNAUTHORIZED || statusCode === STATUS_CODE_UNAUTHORIZED;
        const isRedirect = status === STATUS_CODE_TEMP_REDIRECT
          || status === STATUS_CODE_PERMANENT_REDIRECT
          || statusCode === STATUS_CODE_TEMP_REDIRECT
          || statusCode === STATUS_CODE_PERMANENT_REDIRECT;

        // TODO: Correct way to handle 404
        if (isForbidden) {
          // Redirect to Login page with the redirected URL
          const query = qs.stringify({ next: req.url });
          res.status(STATUS_CODE_FORBIDDEN);
          return res.redirect(`/login?${query}`);
        }
        else if (isUnauthorized) {
          // Redirect to Login page with the redirected URL
          const query = qs.stringify({ next: req.url });
          res.status(STATUS_CODE_UNAUTHORIZED);
          return res.redirect(`/login?${query}`);
        }
        else if (isRedirect && redirectPath) {
          return res.redirect(status || statusCode, redirectPath);
        }
        else {
          // Unknown error, pass it down to the next error middleware
          return next(err);
        }
      }
      // Render component mwarkup
      const componentMarkUp = renderToString(<Root store={ store } />);
      // Retrieve modules which need to be loaded asynchronously
      const rootDir = path.resolve(__dirname, "../../../");
      const asyncModules = flushServerSideRequirePaths().map(p => `${p.replace(rootDir, ".")}.js`);
      // Retrieve required title, headers, links & scripts
      const helmet = Helmet.renderStatic();
      // Render HTML & send back as response to client
      const html = renderToStaticMarkup(
        <HtmlDocument
          helmet={ helmet }
          state={ dehydrate(store.getState()) }
          markup={ componentMarkUp }
          webpackAssets={ webpackAssets }
          asyncModules={ asyncModules }
        />,
      );
      const docType = "<!DOCTYPE html>";
      return res.send(`${docType}${html}`);
    });
  // Push the requested URL into history
  history.push(req.url);
  // Dispatch special 'END' action to end all running sagas
  store.dispatch(END);
}

export default function (app) {
  app.use(render);
}
