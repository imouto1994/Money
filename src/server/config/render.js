import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Helmet from "react-helmet";
import createMemoryHistory from "history/createMemoryHistory";
import { END } from "redux-saga";
import path from "path";
import { flushServerSideRequirePaths } from "react-loadable";

import Root from "../../components/Root";
import HtmlDocument from "../../components/HtmlDocument";
import { dehydrate } from "../../reducers";
import configureStore from "../../redux";
import createRootSaga from "../../sagas";
import { NODE_ENV } from "../../Config";

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

  const store = configureStore();
  const history = createMemoryHistory();
  store
    .runSaga(createRootSaga(history))
    .done
    .then(() => {
      const componentMarkUp = renderToString(<Root store={ store } />);
      const rootDir = path.resolve(__dirname, "../../../");
      const asyncChunks = flushServerSideRequirePaths()
        .map(p => p.replace(rootDir, "."))
        .map(p => `${p}.js`);
      const helmet = Helmet.renderStatic();
      const html = renderToStaticMarkup(
        <HtmlDocument
          helmet={ helmet }
          state={ dehydrate(store.getState()) }
          markup={ componentMarkUp }
          webpackAssets={ webpackAssets }
          asyncChunks={ asyncChunks }
        />,
      );
      const docType = "<!DOCTYPE html>";
      res.send(`${docType}${html}`);
    });
  history.push(req.url);
  store.dispatch(END);
}

export default function (app) {
  app.use(render);
}
