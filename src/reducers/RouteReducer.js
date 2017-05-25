import { Map, fromJS } from "immutable";

import {
  ROUTE_CHANGE_COMPONENT,
  ROUTE_UPDATE_PATH,
} from "../constants/Actions";

/**
 * Initial state for 'Route' module of Redux Store
 */
const initialState = new Map({
  // Page Element to be presented to user
  element: undefined,
  // Current Route
  route: undefined,
  // Path of the current route
  path: undefined,
  // Params of the route
  params: undefined,
  // Query of the route
  query: undefined,
  // Route name
  name: undefined,
});

/**
 * Reducer for 'Route' module of Redux Store
 * @param  {Object} state
 * @param  {Action} action
 * @return {Object}
 */
export default function routeReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ROUTE_CHANGE_COMPONENT:
      return state.set("element", payload);
    case ROUTE_UPDATE_PATH:
      return state.merge(payload);
    default:
      return state;
  }
}

export function dehydrate(state) {
  return state.delete("element").toJS();
}

export function rehydrate(dehydratedState) {
  return fromJS(dehydratedState);
}
