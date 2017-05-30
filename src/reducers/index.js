import { combineReducers } from "redux";
import mapValues from "lodash/mapValues";

import RouteReducer, { dehydrate as routeDehydrate } from "./RouteReducer";
import { dehydrate as defaultDehydrate, rehydrate as defaultRehydrate } from "../utils/reducer";

const reducers = combineReducers({
  Route: RouteReducer,
});

export default reducers;

/**
 * Dehydrate Redux Store to pass to client from server side
 * @param {Object} state
 * @return {Object}
 */
export function dehydrate(state) {
  return mapValues(
    state,
    (value, key) => {
      if (key === "Route") {
        return routeDehydrate(value);
      }
      else {
        return defaultDehydrate(value);
      }
    },
  );
}

/**
 * Rehydrate state to pass back to Redux store on client side
 * @param {Object} dehydratedState
 * @return {Object}
 */
export function rehydrate(dehydratedState) {
  return mapValues(
    dehydratedState,
    value => defaultRehydrate(value),
  );
}
