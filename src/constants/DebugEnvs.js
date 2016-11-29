import keyMirror from "keymirror";
import mapValues from "lodash/mapValues";

module.exports = mapValues(
  keyMirror({
    SERVER: null,
    WEBPACK_SERVER: null,
  }),
  value => `MONEY_${value}`,
);
