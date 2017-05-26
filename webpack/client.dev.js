const webpack = require("webpack");
const path = require("path");
const mapValues = require("lodash/mapValues");

const { SERVER_PORT } = require("../config").default;
const clientConfig = require("../config").default.createConfig(true);
const { client: babelClientConfig } = require("../config/babel");
const featureFlags = require("../feature");
const writeStats = require("./utils/writeStats").default;

const ASSETS_PATH = path.resolve(__dirname, "../public/build");
const WEBPACK_HOST = "localhost";
const WEBPACK_PORT = parseInt(SERVER_PORT, 10) + 1 || 4000;

/**
 * Configuration for client bundle in development mode
 */
module.exports = {
  target: "web",
  // Source Map Configuration for JS Bundle
  devtool: "cheap-module-eval-source-map",
  // Entry input for bundle
  entry: {
    main: [
      // Activation for HMR React
      "react-hot-loader/patch",
      // Bundle the client for webpack-dev-server and connect to the provided endpoint
      `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
      // Bundle the client for hot reloading only - means to only hot reload for successful updates
      "webpack/hot/only-dev-server",
      // Client entry point
      "./src/client/index.js",
    ],
    vendor: [
      "react",
      "react-dom",
      "prop-types",
      "redux",
      "react-redux",
      "reselect",
      "redux-saga",
    ],
  },
  // Output for bundle
  output: {
    path: ASSETS_PATH,
    filename: "[name].js",
    chunkFilename: "[name].js",
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/build/`,
  },
  // Modules for webpack to compile
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|json)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
        include: [
          path.resolve(__dirname, "../src/"),
        ],
      },
      {
        test: /\.js$/,
        use: [
          "cache-loader",
          {
            loader: "babel-loader",
            options: babelClientConfig,
          },
        ],
        exclude: [
          path.resolve(__dirname, "../node_modules/"),
        ],
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      // CSS Modules
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              singleton: true,
            },
          },
          "cache-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]__[local]___[hash:base64:5]",
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
        include: [
          path.resolve(__dirname, "../src/"),
        ],
      },
    ],
  },
  // List of injected plugins
  plugins: [
    // Ignore node_modules so CPU usage with poll watching drops significantly.
    new webpack.WatchIgnorePlugin([
      path.resolve(__dirname, "../node_modules/"),
      path.resolve(__dirname, "../public/"),
    ]),

    // Common Chunk Plugin
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"],
      minChunks: Infinity,
    }),

    // Enable Hot Reload for development environment
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    // Global variables definition
    new webpack.DefinePlugin({
      "process.env": mapValues(clientConfig, value => JSON.stringify(value)),
      _FEATURE_: mapValues(featureFlags, value => JSON.stringify(value)),
    }),

    function StatsWriterPlugin() {
      this.plugin("done", writeStats);
    },
  ],
};
