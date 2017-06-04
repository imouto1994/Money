// Polyfill Promise on server-side using "bluebird"
global.Promise = require("bluebird");

// Start the server app
require("./src/server");
