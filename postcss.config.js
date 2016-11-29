/* eslint-disable global-require */
module.exports = () => ({
  plugins: [
    // Auto prefixing necessary CSS Properties to support multiple browsers
    require("autoprefixer")({ browsers: ["last 2 versions"] }),
    // Allow to define mixins in CSS
    require("postcss-mixins")(),
    // Allow to write nested CSS
    require("postcss-nested")(),
    // Allow to use variables in CSS
    require("postcss-simple-vars")(),
    // Auto transform `calc` if possible to reduce computation
    require("postcss-calc")(),
  ],
});
/* eslint-enable global-require */
