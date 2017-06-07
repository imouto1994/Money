/**
 * Babel presets and plugins config file
 * NODE_ENV determines what configurations are being used
 */

// Node Environment. This will be defaulted to development environment.
const NODE_ENV = process.env.NODE_ENV || "development";

// Babel config for server (node)
const server = {
  presets: [
    // ES6 features not supported by NodeJS
    ["env", { targets: { node: "current" }, useBuiltIns: true }],
    // Stage-0 proposal features
    "stage-0",
    // React
    "react",
  ],
  plugins: [
    // Polyfill dynamic import for NodeJS. This will make it as a defer import
    "dynamic-import-node",
    [
      // Remove duplication of babel-helpers
      "transform-runtime",
      // Remove all polyfills and shim for generators
      { polyfill: false, regenerator: false },
    ],
    // Custom plugin to support `withStyles` HoC
    "withStyles/babel",
    // Custom plugin to support `react-loadable` HoC
    [
      "react-loadable/babel",
      {
        server: true,
        webpack: false,
      },
    ],
    // Strip all Flow types
    "transform-flow-strip-types",
  ],
};

// Babel config for client
const client = {
  presets: [
    [
      "es2015",
      // We will use modules from Webpack instead for client bundle
      { modules: false },
    ],
    // Stage-0 proposal features
    "stage-0",
    // React
    "react",
  ],
  plugins: [
    [
      // Remove duplication of babel-helpers
      "transform-runtime",
      // Remove all polyfills and shim for generators
      { polyfill: false, regenerator: false },
    ],
    // Custom plugin to support `react-loadable` HoC
    [
      "react-loadable/babel",
      {
        server: false,
        webpack: true,
      },
    ],
    // Strip all Flow types
    "transform-flow-strip-types",
  ],
};

if (NODE_ENV === "production") {
  server.presets = server.presets.concat([
    // A preset to optimize react
    "react-optimize",
  ]);

  client.presets = client.presets.concat([
    // A preset to optimize react
    "react-optimize",
  ]);
} else if (NODE_ENV === "development") {
  // Hot Module Reload for React
  client.plugins = client.plugins.concat(["react-hot-loader/babel"]);
}

module.exports = { server, client };
