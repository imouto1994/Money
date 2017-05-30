import { Iterable, fromJS } from "immutable";

/**
 * Common dehydrate function for a module inside Redux store
 * @param {Immutable Iterable | Object } state
 * @return {Object}
 */
export function dehydrate(state) {
  if (Iterable.isIterable(state)) {
    return state.toJS();
  }

  return state;
}

/**
 * Common rehydrate function for a module inside Redux store
 * @param {Object} state
 * @return {Immutable Map}
 */
export function rehydrate(state) {
  return fromJS(state);
}
