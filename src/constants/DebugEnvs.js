const keyMirror = require("keymirror");
const mapValues = require("lodash/mapValues");

module.exports = mapValues(
  keyMirror({
    CLIENT: null,
    SERVER: null,
    WEBPACK_SERVER: null,
  }),
  value => `MONEY_${value}`,
);
