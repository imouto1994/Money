// Babel-register required for some required modules that are written in ES6
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

const assetsPath = path.join(__dirname, "../public/build");
const publicPath = `${config.ASSETS_ROOT_URL}/build/`;

/**
* Configuration for client bundle in production mode
*/
module.exports = {
  target: "web",
  entry: {
    main: "./src/client.js",
  },
  output: {
    path: assetsPath,
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[hash].js",
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
              name: "[name]-[hash].[ext]",
            },
          },
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
        exclude: [
          path.resolve(__dirname, "../node_modules/"),
        ],
      },
    ],
  },
  plugins: [
    // Ignore `debug` statements
    new webpack.NormalModuleReplacementPlugin(/debug/, `${process.cwd()}/webpack/utils/noop.js`),

    // Bundle CSS file from the "extract-text-plugin" loader
    new ExtractTextPlugin("[name]-[hash].css"),

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
  ],
};
