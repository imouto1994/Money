import { take, select, put, fork } from "redux-saga/effects";
import qs from "qs";

import { push } from "../actions/RouteActions";
import { routeUrlSelector } from "../selectors/RouteSelectors";
import {
  STATUS_CODE_UNAUTHORIZED,
  STATUS_CODE_FORBIDDEN,
  STATUS_CODE_PERMANENT_REDIRECT,
  STATUS_CODE_TEMP_REDIRECT,
} from "../constants/Http";

export function* watchErrors() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { err } = yield take(action => action.err != null);
    const { status = 0, statusCode = 0, redirectPath } = err;
    const code = status || statusCode;
    const isForbidden = code === STATUS_CODE_FORBIDDEN;
    const isUnauthorized = code === STATUS_CODE_UNAUTHORIZED;
    const isRedirect = code === STATUS_CODE_PERMANENT_REDIRECT || code === STATUS_CODE_TEMP_REDIRECT;
    const isServerError = code > 500;
    if (isForbidden) {
      // Redirect to Login page with the redirected URL
      const url = yield select(routeUrlSelector);
      const query = qs.stringify({ next: url });
      yield put(push(`/login?${query}`));
    }
    else if (isUnauthorized) {
      // Redirect to Login page with the redirected URL
      const url = yield select(routeUrlSelector);
      const query = qs.stringify({ next: url });
      yield put(push(`/login?${query}`));
    }
    else if (isRedirect && redirectPath) {
      yield put(push(redirectPath));
    }
    else if (isServerError) {
      yield fork(alert, `Internal Server Error ${code} T_T`);
    }
  }
}
