import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware, { END } from "redux-saga";
import { enableBatching } from "redux-batched-actions";
import { batchedSubscribe } from "redux-batched-subscribe";

import rootReducer from "../reducers";

const sagaMiddleware = createSagaMiddleware();
let middlewares;
if (process.env.NODE_ENV === "development") {
  const loggerMiddleware = createLogger();
  middlewares = [sagaMiddleware, loggerMiddleware];
}
else {
  middlewares = [sagaMiddleware];
}

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
  if (process.env.NODE_ENV === "development") {
    if (module.hot) {
      module.hot.accept("../reducers", () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  // Attach some helper functions for 'redux-saga' to work on server-side
  const extendedStore = {
    ...store,
    runSaga: sagaMiddleware.run,
    close: () => {
      store.dispatch(END);
    },
  };

  return extendedStore;
}
