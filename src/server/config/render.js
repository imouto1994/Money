import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import createMemoryHistory from "history/createMemoryHistory";
import { END } from "redux-saga";
import { flushServerSideRequirePaths } from "react-loadable";
import qs from "qs";
import Fetchr from "fetchr";

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

  // Initialize Fetchr Server Instance
  const csrfToken = req.csrfToken();
  const fetchr = new Fetchr({
    req,
    xhrTimeout: 1000,
    context: {
      _csrf: csrfToken,
    },
  });

  // Intialize Redux
  const store = configureStore(undefined, fetchr);
  const history = createMemoryHistory();
  store
    .runSaga(createRootSaga(history))
    .done
    .then(() => {
      const err = errorSelector(store.getState());

      // Handle error
      if (err) {
        const { status = 0, statusCode = 0, redirectPath } = err;
        const code = status || statusCode;
        const isForbidden = code === STATUS_CODE_FORBIDDEN;
        const isUnauthorized = code === STATUS_CODE_UNAUTHORIZED;
        const isRedirect = code === STATUS_CODE_TEMP_REDIRECT || code === STATUS_CODE_PERMANENT_REDIRECT;
        const isServerError = code > 500;

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
          return res.redirect(code, redirectPath);
        }
        else if (isServerError) {
          // Unknown error, pass it down to the next error middleware
          return next(err);
        }
      }

      // Fetch translation text
      const { locale } = req;
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const messages = require(`../../intl/json/${locale}.json`).messages;

      // Render component mwarkup
      const componentMarkUp = renderToString(
        <Root store={ store } locale={ locale } messages={ messages } />,
      );

      // Retrieve modules which need to be loaded asynchronously
      const asyncModules = flushServerSideRequirePaths().map(p => `./${p}.js`);

      // Retrieve required title, headers, links & scripts
      const helmet = Helmet.renderStatic();

      // Render HTML & send back as response to client
      const html = renderToStaticMarkup(
        <HtmlDocument
          csrf={ csrfToken }
          lang={ locale }
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
