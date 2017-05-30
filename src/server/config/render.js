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

  // Intialize Redux
  const store = configureStore();
  const history = createMemoryHistory();
  store
    .runSaga(createRootSaga(history))
    .done
    .then(() => {
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
      res.send(`${docType}${html}`);
    });
  // Push the requested URL into history
  history.push(req.url);
  // Dispatch special 'END' action to end all running sagas
  store.dispatch(END);
}

export default function (app) {
  app.use(render);
}
