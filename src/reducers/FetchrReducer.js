import { Map } from "immutable";

const initialState = new Map({
  instance: undefined,
});

/**
 * Reducer for 'Fetchr' module which stores the current instance of 'Fetchr'
 * @param {Immutable.Map} state - current state of the module
 * @param {ReduxAction} action - dispatched action
 * @return {Immutable.Map}
 */
export default function fetchrReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    default:
      return state;
  }
}
