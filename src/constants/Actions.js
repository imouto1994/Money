const keyMirror = require("keymirror");

module.exports = keyMirror({
  // Route Actions
  ROUTE_CHANGE_COMPONENT: null,
  ROUTE_UPDATE_PATH: null,

  ROUTE_HISTORY_PUSH: null,
  ROUTE_HISTORY_REPLACE: null,
  ROUTE_HISTORY_GO: null,
  ROUTE_HISTORY_GO_BACK: null,
  ROUTE_HISTORY_GO_FORWARD: null,

  // Error Actions
  ERROR_ADD: null,
  ERROR_REMOVE: null,

  // Product Actions
  PRODUCT_FETCH: null,
  PRODUCT_FETCH_PENDING: null,
  PRODUCT_FETCH_COMPLETE: null,

  PRODUCT_CREATE: null,
  PRODUCT_CREATE_PENDING: null,
  PRODUCT_CREATE_COMPLETE: null,
});
