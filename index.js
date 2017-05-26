/* eslint-disable global-require */
if (process.env.NODE_ENV === "development") {
  // Register babel to have ES6 support on the server
  require("babel-register")(require("./config/babel").server);

  // Hook CSS Modules for NodeJS 'require'
  const cssModulesRequireHook = require("css-modules-require-hook");
  cssModulesRequireHook({ generateScopedName: "[name]__[local]___[hash:base64:5]" });
}
/* eslint-enable global-require */

// Polyfill Promise on server-side using "bluebird"
global.Promise = require("bluebird");

// Attach feature flags as a global variable
global._FEATURE_ = require("./feature");

// Start the server app
require("./src/server");
