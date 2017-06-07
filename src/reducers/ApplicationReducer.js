import { Map } from "immutable";

const initialState = new Map({
  serverDate: Date.now(),
});

/**
 * Reducer for 'Application' module which contains all general app data
 * @param {Immutable.Map} state - current state of the module
 * @param {ReduxAction} action - dispatched action
 * @return {Immutable.Map}
 */
export default function applicationReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    default:
      return state;
  }
}
