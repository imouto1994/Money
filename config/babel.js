/**
 * Babel presets and plugins config file
 * NODE_ENV determines what configurations are being used
 */

// Node Environment. This will be defaulted to development environment.
const NODE_ENV = process.env.NODE_ENV || "development";

// Babel config for server (node)
const server = {
  presets: [
    // Server side es6 features not supported by node
    [
      "env",
      { targets: { node: 6.0 } },
    ],
    "stage-0",
    "react",
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
    "stage-0",
    "react",
  ],
  plugins: [
    [
      // Remove duplication of babel-helpers
      "transform-runtime",
      // Remove all polyfills and shim for generators
      { polyfill: false, regenerator: false },
    ],
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
}
else if (NODE_ENV === "development") {
  // Hot Module Reload for React
  client.plugins = client.plugins.concat([
    "react-hot-loader/babel",
  ]);
}

module.exports = { server, client };
