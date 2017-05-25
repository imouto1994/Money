import { fork, take, put, call, race } from "redux-saga/effects";
import { eventChannel, buffers, END } from "redux-saga";
import RouteRecognizer from "route-recognizer";
import camelCase from "lodash/camelCase";
import forEach from "lodash/forEach";
import get from "lodash/get";

import { updatePath, changeComponent } from "../actions/RouteActions";
import { getRequireComponent } from "../routes";
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
import { BROWSER } from "../Config";

const HISTORY_ACTIONS = [
  ROUTE_HISTORY_PUSH,
  ROUTE_HISTORY_REPLACE,
  ROUTE_HISTORY_GO,
  ROUTE_HISTORY_GO_BACK,
  ROUTE_HISTORY_GO_FORWARD,
];

function createRouteRecognizer(routes) {
  const router = new RouteRecognizer();
  forEach(routes, route => {
    router.add([route]);
  });

  return router;
}

function createLocationChannel(history) {
  return eventChannel(
    emit => history.listen(location => {
      emit(location);
      // On server side, we will only need to emit location change once
      // After that, we should end the channel
      if (!BROWSER) {
        emit(END);
      }
    }),
    buffers.expanding(),
  );
}

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
      }
      else if (location) {
        return {
          location,
        };
      }
    }
    else {
      effectRes = yield effect;
    }
  }

  return {
    location: undefined,
  };
}

function* watchLocationChange(routes, history) {
  const channel = createLocationChannel(history);
  const router = createRouteRecognizer(routes);
  let nextLocation;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    let routeArgs;
    let routeHandler;
    let requireComponent;
    const location = nextLocation != null ? nextLocation : yield take(channel, "");
    const pathName = location.pathname;
    const route = get(router.recognize(pathName), 0);

    if (route) {
      const { handler, params } = route;
      const { name, saga } = handler;

      routeArgs = {
        name,
        path: pathName,
        params,
        query: parseQueryString(location.search),
      };
      routeHandler = saga;
      requireComponent = getRequireComponent(name);

      yield put(updatePath(routeArgs));
    }
    else {
      // TODO: To be filled in
    }
    if (requireComponent != null) {
      const component = yield requireComponent();
      yield put(changeComponent(component));
    }
    const iterator = routeHandler(routeArgs);
    const { loc } = yield call(handleRoute, iterator, channel);
    if (loc != null) {
      nextLocation = loc;
    }
  }
}

function* watchHistoryActions(history) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { type, payload } = yield take(HISTORY_ACTIONS);
    const historyFunction = history[camelCase(type.replace("ROUTE_HISTORY_", ""))];
    historyFunction(...payload);
  }
}

// eslint-disable-next-line import/prefer-default-export
export function* watchRoutes(routes, history) {
  yield fork(watchLocationChange, routes, history);
  yield fork(watchHistoryActions, history);
}
