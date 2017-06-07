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
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const serverConfig = require("../config").default.createConfig(false);
const { server: babelServerConfig } = require("../config/babel");
const featureFlags = require("../feature");
const { default: formatCriticalCSSJson } = require("./utils/cssMapJsonFormat");

const ASSETS_PATH = path.resolve(__dirname, "../public/build/server");

/**
 * Configuration for server bundle in production mode
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
    publicPath: "/build/server/",
  },
  // Modules for webpack to compile
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: babelServerConfig,
          },
        ],
        exclude: [path.resolve(__dirname, "../node_modules/")],
      },
      // CSS Modules
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: path.resolve(__dirname, "./utils/cssMapJsonLoader"),
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
        }),
        include: [path.resolve(__dirname, "../src/")],
      },
    ],
  },
  // List of injected plugins
  plugins: [
    // Ignore `debug` statements
    new webpack.NormalModuleReplacementPlugin(
      /debug/,
      `${process.cwd()}/webpack/utils/noop.js`
    ),

    // Global variables definition
    new webpack.DefinePlugin({
      "process.env": mapValues(serverConfig, value => JSON.stringify(value)),
      _FEATURE_: mapValues(featureFlags, value => JSON.stringify(value)),
    }),

    // Bundle CSS file from the "extract-text-plugin" loader
    new ExtractTextPlugin("css-map.json"),

    // Add source map at the top of each generated chunk
    new webpack.BannerPlugin({
      banner: "require('source-map-support').install();",
      raw: true,
      entryOnly: false,
      test: /(\.js)$/,
    }),

    // Limit number of chunks to only one for server bundle
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),

    // Optimization Plugins
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    // Format CSS Map
    function StatsWriterPlugin() {
      this.plugin("done", formatCriticalCSSJson);
    },
  ],
  // Node variables configuration
  node: {
    __dirname: true,
    __filename: true,
  },
  // Node Externals
  externals: [
    nodeExternals({
      whitelist: ["source-map-support/register"],
    }),
    /(\/css-map.json)$/,
    /(\/webpack-stats.json)$/,
    /(\/views\/index.marko)$/,
  ],
};
