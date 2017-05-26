import { combineReducers } from "redux";

import RouteReducer, { dehydrate as routeDehydrate, rehydrate as routeRehydrate } from "./RouteReducer";

const reducers = combineReducers({
  Route: RouteReducer,
});

export default reducers;

/* eslint-disable no-param-reassign */
/**
 * Dehydrate Redux Store to pass to client from server side
 * @param {Object} state
 * @return {Object}
 */
export function dehydrate(state) {
  const res = { ...state };
  res.Route = routeDehydrate(res.Route);
  return res;
}

/**
 * Rehydrate state to pass back to Redux store on client side
 * @param {Object} dehydratedState
 * @return {Object}
 */
export function rehydrate(dehydratedState) {
  const res = { ...dehydratedState };
  res.Route = routeRehydrate(res.Route);
  return res;
}
/* eslint-enable no-param-reassign */
