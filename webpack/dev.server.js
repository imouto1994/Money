/**
 * Starts a webpack dev server for dev environments
 */

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const debug = require("debug");

const WebpackConfig = require("./client.dev");
const DebugEnvs = require("../src/constants/DebugEnvs");
const Config = require("../src/Config");

const log = debug(DebugEnvs.WEBPACK_SERVER);

const WEBPACK_SERVER_HOST = Config.SERVER_HOST;
const WEBPACK_SERVER_PORT = parseInt(Config.SERVER_PORT, 10) + 1;

const serverOptions = {
  proxy: {
    "*": `http://${WEBPACK_SERVER_HOST}:${WEBPACK_SERVER_PORT}`,
  },
  quiet: false,
  noInfo: false,
  stats: "normal",
  hot: true,
  publicPath: WebpackConfig.output.publicPath,
  headers: { "Access-Control-Allow-Origin": "*" },
};

const webpackCompiler = webpack(WebpackConfig);
const webpackDevServer = new WebpackDevServer(webpackCompiler, serverOptions);

webpackDevServer.listen(WEBPACK_SERVER_PORT, WEBPACK_SERVER_HOST, () => {
  log(
    `Webpack development server listening on ${WEBPACK_SERVER_HOST}:${WEBPACK_SERVER_PORT}`
  );
});
