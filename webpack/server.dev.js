// Babel-register required for some required modules that are written in ES6
// This is here since this webpack config will be run directly from command
// instead of being referred by Webpack Dev Server like in development environment
require("babel-register")({
  presets: ["es2015", "stage-0"],
});

const webpack = require("webpack");
const path = require("path");
const mapValues = require("lodash/mapValues");
const nodeExternals = require("webpack-node-externals");

const { SERVER_PORT } = require("../config").default;
const serverConfig = require("../config").default.createConfig(false);
const { server: babelServerConfig } = require("../config/babel");
const featureFlags = require("../feature");

const ASSETS_PATH = path.resolve(__dirname, "../public/build");
const WEBPACK_HOST = "localhost";
const WEBPACK_PORT = parseInt(SERVER_PORT, 10) + 1 || 4000;

/**
 * Configuration for client bundle in development mode
 */
module.exports = {
  // Target for bundle
  target: "node",
  // Source Map Configuration for JS Bundle
  devtool: "source-map",
  // Entry input for bundle
  entry: {
    main: [
      // Server entry point
      "./index.js",
    ],
  },
  // Output for bundle
  output: {
    path: ASSETS_PATH,
    filename: "[name].js",
    chunkFilename: "[name].js",
    libraryTarget: "commonjs2",
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/build/`,
  },
  // Modules for webpack to compile
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: path.resolve(__dirname, "../.cache-loader-server"),
            },
          },
          {
            loader: "babel-loader",
            options: babelServerConfig,
          },
        ],
        exclude: [
          path.resolve(__dirname, "../node_modules/"),
        ],
      },
      // CSS Modules
      {
        test: /\.css$/,
        use: [
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: path.resolve(__dirname, "../.cache-loader-server"),
            },
          },
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
    // Global variables definition
    new webpack.DefinePlugin({
      "process.env": mapValues(serverConfig, value => JSON.stringify(value)),
      _FEATURE_: mapValues(featureFlags, value => JSON.stringify(value)),
    }),

    // Add source map at the top of each generated chunk
    new webpack.BannerPlugin({
      banner: "require('source-map-support').install();",
      raw: true,
      entryOnly: false,
    }),

    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  node: {
    __dirname: true,
    __filename: true,
  },
  performance: false,
  externals: [
    nodeExternals({
      whitelist: [
        "source-map-support/register",
      ],
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "../src/"),
    },
  }
};
