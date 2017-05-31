// Babel-register required for some required modules that are written in ES6
// This is here since this webpack config will be run directly from command
// instead of being referred by Webpack Dev Server like in development environment
require("babel-register")({
  presets: ["es2015", "stage-0"],
});

const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const mapValues = require("lodash/mapValues");

const config = require("../src/Config").default;
const { client: babelClientConfig } = require("../config/babel");
const featureFlags = require("../feature");
const writeStats = require("./utils/writeStats").default;

const assetsPath = path.join(__dirname, "../public/build");
const publicPath = `${config.ASSETS_ROOT_URL}/build/`;

/**
* Configuration for client bundle in production mode
*/
// TODO: Update config with all the changes
module.exports = {
  target: "web",
  entry: {
    main: "./src/client.js",
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
  output: {
    path: assetsPath,
    filename: "[name]_[hash].js",
    chunkFilename: "[name]_[hash].js",
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|json)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash].[ext]",
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
        use: ExtractTextPlugin.extract({
          fallback: [
            {
              loader: "style-loader",
              options: {
                singleton: true,
              },
            },
          ],
          use: [
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
        include: [
          path.resolve(__dirname, "../src/"),
        ],
      },
    ],
  },
  plugins: [
    // Ignore `debug` statements
    new webpack.NormalModuleReplacementPlugin(/debug/, `${process.cwd()}/webpack/utils/noop.js`),

    // Bundle CSS file from the "extract-text-plugin" loader
    new ExtractTextPlugin("[name]_[hash].css"),

    // Common Chunk Plugin
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"],
      minChunks: Infinity,
    }),

    // Environment variables
    new webpack.DefinePlugin({
      "process.env": mapValues(config, value => JSON.stringify(value)),
      _FEATURE_: mapValues(featureFlags, value => JSON.stringify(value)),
    }),

    // Optimization Plugins
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),

    function StatsWriterPlugin() {
      this.plugin("done", writeStats);
    },
  ],
};
