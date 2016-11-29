// Register babel to have ES6 support on the server
require("babel-register")(require("../config/babel").server);

require("./dev.server");
