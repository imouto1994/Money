let featureDev = {};

try {
  /* eslint-disable global-require, import/no-unresolved, no-console */
  featureDev = require("./feature.dev");
  console.log("Overriding official feature toggles with local feature toggles");
  /* eslint-enable global-require, import/no-unresolved, no-console */
}
catch (error) {
  // No local feature toggle
}

module.exports = {
  ...featureDev,
};
