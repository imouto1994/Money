import React from "react";
import { renderToString } from "react-dom/server";
import Helmet from "react-helmet";
import createMemoryHistory from "history/createMemoryHistory";
import { END } from "redux-saga";
import { flushServerSideRequirePaths } from "react-loadable";
import qs from "qs";
import Fetchr from "fetchr";
import { flushStyledComponentFileNames } from "withStyles";
import get from "lodash/get";
import values from "lodash/values";
import flatten from "lodash/flatten";
import serialize from "serialize-javascript";

import Root from "../../components/Root";
import { errorSelector } from "../../selectors/ErrorSelectors";
import { dehydrate } from "../../reducers";
import configureStore from "../../redux";
import createRootSaga from "../../sagas";
import {
  STATUS_CODE_UNAUTHORIZED,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_PERMANENT_REDIRECT,
  STATUS_CODE_TEMP_REDIRECT,
} from "../../constants/Http";
import htmlTemplate from "../../../src/server/views/index.marko";

let webpackAssets;
let cssMap;
if (process.env.NODE_ENV === "production") {
  /* eslint-disable global-require */
  webpackAssets = require("../client/webpack-stats.json");
  cssMap = require("./css-map.json");
  /* eslint-enable global-require */
}

/**
 * Render middleware
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {Function} next - callback to pass to the next middleware
 */
function render(req, res, next) {
  if (process.env.NODE_ENV === "development") {
    /* eslint-disable global-require */
    webpackAssets = require("../client/webpack-stats.json");
    cssMap = require("./css-map.json");
    /* eslint-enable global-require */

    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    delete require.cache[require.resolve("../client/webpack-stats.json")];
    delete require.cache[require.resolve("./css-map.json")];
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
  store.runSaga(createRootSaga(history)).done.then(() => {
    const err = errorSelector(store.getState());

    // Handle error
    if (err) {
      const { status = 0, statusCode = 0, redirectPath } = err;
      const code = status || statusCode;
      const isForbidden = code === STATUS_CODE_FORBIDDEN;
      const isUnauthorized = code === STATUS_CODE_UNAUTHORIZED;
      const isRedirect =
        code === STATUS_CODE_TEMP_REDIRECT ||
        code === STATUS_CODE_PERMANENT_REDIRECT;
      const isServerError = code > 500;

      // TODO: Correct way to handle 404
      if (isForbidden) {
        // Redirect to Login page with the redirected URL
        const query = qs.stringify({ next: req.url });
        res.status(STATUS_CODE_FORBIDDEN);
        return res.redirect(`/login?${query}`);
      } else if (isUnauthorized) {
        // Redirect to Login page with the redirected URL
        const query = qs.stringify({ next: req.url });
        res.status(STATUS_CODE_UNAUTHORIZED);
        return res.redirect(`/login?${query}`);
      } else if (isRedirect && redirectPath) {
        return res.redirect(code, redirectPath);
      } else if (isServerError) {
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
      <Root store={store} locale={locale} messages={messages} />
    );

    // Retrieve modules which need to be loaded asynchronously
    const asyncModules = flushServerSideRequirePaths().map(p => `./${p}.js`);
    const cssFilesSet = flushStyledComponentFileNames()
      .map(p => `./${p}`)
      .reduce((set, componentFilePath) => {
        const relatedCSSFiles =
          webpackAssets.moduleCSS[componentFilePath] || [];
        relatedCSSFiles.forEach(file => {
          // eslint-disable-next-line no-param-reassign
          set[file] = 1;
        });

        return set;
      }, {});
    const criticalStyles = cssMap
      .filter(cssFile => cssFilesSet[cssFile.module] != null)
      .map(cssFile => cssFile.css)
      .join("\n");
    const scriptFiles = [
      ...webpackAssets.scripts.manifest.map(path => ({ path })),
      ...webpackAssets.scripts.vendor.map(path => ({ path })),
      ...flatten(
        asyncModules.map(module => get(webpackAssets, ["modules", module]))
      )
        .filter(asset => asset != null)
        .filter((asset, i, arr) => arr.indexOf(asset) === i)
        .map(asset => ({ path: asset })),
      ...webpackAssets.scripts.main.map(path => ({ path })),
    ];

    // Retrieve required title, headers, links & scripts
    const helmet = Helmet.renderStatic();

    // Use Marko template engine to return generated HTML String
    res.marko(htmlTemplate, {
      lang: locale,
      langFile: get(webpackAssets, ["translations", locale]),
      helmetTitle: helmet.title.toString() || "",
      helmetMeta: helmet.meta.toString(),
      helmetLink: helmet.link.toString(),
      helmetScript: helmet.script.toString(),
      csrf: csrfToken,
      cssFiles: process.env.NODE_ENV === "production"
        ? flatten(values(webpackAssets.stylesheets))
        : [],
      criticalStyles: criticalStyles,
      state: serialize(dehydrate(store.getState()), { isJSON: true }),
      markup: componentMarkUp,
      scriptFiles,
    });
  });

  // Push the requested URL into history
  history.push(req.url);

  // Dispatch special 'END' action to end all running sagas
  store.dispatch(END);
}

/**
 * Setup main render logic for server
 * @param {Express} app
 */
export default function(app) {
  app.use(render);
}
