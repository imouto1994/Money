import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { enableBatching } from "redux-batched-actions";
import { batchedSubscribe } from "redux-batched-subscribe";
import { Iterable, Map } from "immutable";

import rootReducer from "../reducers";

// List of middlewares
const middlewares = [];
// Add Saga middleware
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);
// Add "redux-logger" on client side
if (process.env.NODE_ENV === "development") {
  if (process.env.BROWSER) {
    middlewares.push(
      createLogger({
        // Filter out private actions
        predicate(getState, action) {
          return !action.type.startsWith("_");
        },
        // Transform payload to JS Object if it is an Immutable DS
        stateTransformer(state) {
          if (Iterable.isIterable(state)) {
            return state.toJS();
          } else {
            return state;
          }
        },
      })
    );
  }
}

/**
 * Initialize Redux
 * @param {Object} initialState - initial state for the store
 * @param {Fetchr} fetchr - fetchr instance to be used throughout the session
 * This is necessary for the store to rehydrate on client side
 * @return {[type]} [description]
 */
export default function redux(initialState, fetchr) {
  const store = createStore(
    // Batch actions
    enableBatching(rootReducer),
    { ...initialState, Fetchr: new Map({ instance: fetchr }) },
    compose(
      applyMiddleware(...middlewares),
      // Batch subscribe
      batchedSubscribe(notify => notify())
    )
  );

  // Enable Webpack hot module replacement for reducers
  if (process.env.NODE_ENV === "development") {
    if (module.hot) {
      module.hot.accept("../reducers", () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  // Attach some helper functions for running 'redux-saga'
  const extendedStore = {
    ...store,
    runSaga: sagaMiddleware.run,
  };

  return extendedStore;
}
