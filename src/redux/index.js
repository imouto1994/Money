import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { enableBatching } from "redux-batched-actions";
import { batchedSubscribe } from "redux-batched-subscribe";
import { Iterable } from "immutable";

import rootReducer from "../reducers";
import { NODE_ENV, BROWSER } from "../Config";

// List of middlewares
const middlewares = [];
// Add Saga middleware
const sagaMiddleware = createSagaMiddleware();
middlewares.push(sagaMiddleware);
// Add "redux-logger" on client side
if (NODE_ENV === "development") {
  if (BROWSER) {
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
          }
          else {
            return state;
          }
        },
      }),
    );
  }
}

/**
 * Initialize Redux
 * @param {Object} initialState - initial state for the store
 * This is necessary for the store to rehydrate on client side
 */
export default function redux(initialState) {
  const store = createStore(
    // Batch actions
    enableBatching(rootReducer),
    initialState,
    compose(
      applyMiddleware(...middlewares),
      // Batch subscribe
      batchedSubscribe(notify => notify()),
    ),
  );

  // Enable Webpack hot module replacement for reducers
  if (NODE_ENV === "development") {
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
