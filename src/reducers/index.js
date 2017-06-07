import { combineReducers } from "redux";
import mapValues from "lodash/mapValues";

import RouteReducer, { dehydrate as routeDehydrate } from "./RouteReducer";
import ErrorReducer from "./ErrorReducer";
import ApplicationReducer from "./ApplicationReducer";
import FetchrReducer from "./FetchrReducer";
import {
  dehydrate as defaultDehydrate,
  rehydrate as defaultRehydrate,
} from "../utils/reducer";

const reducers = combineReducers({
  Application: ApplicationReducer,
  Route: RouteReducer,
  Error: ErrorReducer,
  Fetchr: FetchrReducer,
});

export default reducers;

/**
 * Dehydrate Redux Store to pass to client from server side
 * @param {Object} state
 * @return {Object}
 */
export function dehydrate(state) {
  return mapValues(state, (value, key) => {
    if (key === "Route") {
      return routeDehydrate(value);
    } else if (key === "Fetchr") {
      // 'Fetchr' module does not need to be rehydrated
      // since we will create a new client instance over there
      return undefined;
    } else {
      return defaultDehydrate(value);
    }
  });
}

/**
 * Rehydrate state to pass back to Redux store on client side
 * @param {Object} dehydratedState
 * @return {Object}
 */
export function rehydrate(dehydratedState) {
  return mapValues(dehydratedState, value => defaultRehydrate(value));
}
