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
  component: undefined,
  // Route name
  name: undefined,
  // Path of the current route
  path: undefined,
  // Params of the route
  params: undefined,
  // Query of the route
  query: undefined,
});

/**
 * Reducer for 'Route' module of Redux Store
 * @param  {Immutable Map} state
 * @param  {Action} action
 * @return {Immutable Map}
 */
export default function routeReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ROUTE_CHANGE_COMPONENT:
      return state.set("component", payload);
    case ROUTE_UPDATE_PATH:
      return state.merge(payload);
    default:
      return state;
  }
}

/**
 * Dehydrate state for passing to client on server side
 * @param {Immutable Map} state
 * @return {Object} [description]
 */
export function dehydrate(state) {
  // Delete property 'component' since it cannot be stringified into JSON format
  return state.delete("component").toJS();
}
