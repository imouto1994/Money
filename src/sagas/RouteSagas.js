import { take, put, call, race, all } from "redux-saga/effects";
import { eventChannel, buffers, END } from "redux-saga";
import RouteRecognizer from "route-recognizer";
import camelCase from "lodash/camelCase";
import forEach from "lodash/forEach";
import get from "lodash/get";

import { updatePath } from "../actions/RouteActions";
import { parseQueryString } from "../utils/route";
import { isPutEffectWithAction, isBlockEffect } from "../utils/saga";
import {
  ROUTE_CHANGE_COMPONENT,
  ROUTE_HISTORY_PUSH,
  ROUTE_HISTORY_REPLACE,
  ROUTE_HISTORY_GO,
  ROUTE_HISTORY_GO_FORWARD,
  ROUTE_HISTORY_GO_BACK,
} from "../constants/Actions";

const HISTORY_ACTIONS = [
  ROUTE_HISTORY_PUSH,
  ROUTE_HISTORY_REPLACE,
  ROUTE_HISTORY_GO,
  ROUTE_HISTORY_GO_BACK,
  ROUTE_HISTORY_GO_FORWARD,
];

/**
 * Create route recognizer to match URL with the corresponding route data
 * @param {Array} routes - list of routes in the application
 * @return {RouteRecognizer}
 */
function createRouteRecognizer(routes) {
  const router = new RouteRecognizer();
  forEach(routes, route => {
    router.add([route]);
  });

  return router;
}

/**
 * Create a channel to queue list of location change events
 * @param {History} history - history channel
 * @return {EventChannel}
 */
function createLocationChannel(history) {
  return eventChannel(
    emit =>
      history.listen(location => {
        emit(location);
        // On server side, we will only need to emit location change once
        // After that, we should end the channel
        if (!process.env.BROWSER) {
          emit(END);
        }
      }),
    buffers.expanding()
  );
}

/**
 * Handle route change action
 * @param {Iterator} iterator - iterator returned from the corresponding route saga handler for the target route
 * @param {EventChannel} channel
 * @return {Location} - location if there is another route change request when handler is being processed
 */
function* handleRoute(iterator, channel) {
  // Result of effect to-be-executed
  let effectRes;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value: effect, done } = iterator.next(effectRes);

    // End of iterator
    if (done) {
      break;
    }

    if (isPutEffectWithAction(effect, ROUTE_CHANGE_COMPONENT)) {
      // TODO: Fill in here if we decide to have leaving hooks
    }

    if (isBlockEffect(effect)) {
      const { main, location } = yield race({
        main: effect,
        location: take(channel),
      });

      if (main) {
        effectRes = main;
      } else if (location) {
        return {
          location,
        };
      }
    } else {
      effectRes = yield effect;
    }
  }

  return {
    location: undefined,
  };
}

/**
 * Watch events when the URL is changed
 * @param {Array} routes - list of routes in the application
 * @param {History} history - history instance
 */
function* watchLocationChange(routes, history) {
  const channel = createLocationChannel(history);
  const router = createRouteRecognizer(routes);

  try {
    let nextLocation;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let routeArgs;
      let routeHandler;
      let RouteComponent;
      const location = nextLocation != null
        ? nextLocation
        : yield take(channel, "");
      const { pathname: pathName, search: queryString } = location;
      const route = get(router.recognize(pathName), 0);

      if (route) {
        const { handler, params } = route;
        const { name, saga, component } = handler;
        routeHandler = saga;
        RouteComponent = component;
        routeArgs = {
          name,
          path: pathName,
          url: `${pathName}${queryString}`,
          params,
          query: parseQueryString(queryString),
        };

        yield put(updatePath(routeArgs));
      } else {
        // TODO: To be filled in
      }

      // Route fetching logic
      const iterator = routeHandler({ ...routeArgs, RouteComponent })();
      const { loc } = yield call(handleRoute, iterator, channel);
      if (loc != null) {
        nextLocation = loc;
      }
    }
  } catch (error) {
    // TODO: Add proper route handling
    // eslint-disable-next-line no-console
    console.log("Generic error handler for route handling");
  }
}

/**
 * Watch actions related to History API
 * @param {History} history - history instance
 */
function* watchHistoryActions(history) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { type, payload } = yield take(HISTORY_ACTIONS);
    const historyFunction =
      history[camelCase(type.replace("ROUTE_HISTORY_", ""))];
    historyFunction(...payload);
  }
}

/**
 * Saga to watch route activities
 * @param {Array} routes - list of routes in the application
 * @param {History} history - history instance for the application
 */
export function* watchRoutes(routes, history) {
  yield all([
    call(watchLocationChange, routes, history),
    call(watchHistoryActions, history),
  ]);
}
