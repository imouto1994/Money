/**
 * Since we are now using `modules` handled by Webpack instead of Babel,
 * it does not allow to mix `import` with `module.exports`
 * So we will use `require` as workaround here instead
 * Reference: https://github.com/webpack/webpack/issues/4039
 */
const Config = require("../config").default;

module.exports = Config;
