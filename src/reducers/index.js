import { combineReducers } from "redux";

import RouteReducer, { dehydrate as routeDehydrate, rehydrate as routeRehydrate } from "./RouteReducer";

const reducers = combineReducers({
  Route: RouteReducer,
});

export default reducers;

/* eslint-disable no-param-reassign */
export function dehydrate(state) {
  const res = { ...state };
  res.Route = routeDehydrate(res.Route);
  return res;
}

export function rehydrate(dehydratedState) {
  const res = { ...dehydratedState };
  res.Route = routeRehydrate(res.Route);
  return res;
}
/* eslint-enable no-param-reassign */
