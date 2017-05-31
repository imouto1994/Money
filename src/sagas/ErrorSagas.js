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
    const { err, payload } = yield take(action => action.err != null);
    const { isSilent } = payload;
    const { status = 0, statusCode = 0, redirectPath } = err;
    if (isSilent) {
      continue;
    }
    const isForbidden = status === STATUS_CODE_FORBIDDEN || statusCode === STATUS_CODE_FORBIDDEN;
    const isUnauthorized = status === STATUS_CODE_UNAUTHORIZED || statusCode === STATUS_CODE_UNAUTHORIZED;
    const isRedirect = status === STATUS_CODE_TEMP_REDIRECT
      || status === STATUS_CODE_PERMANENT_REDIRECT
      || statusCode === STATUS_CODE_TEMP_REDIRECT
      || statusCode === STATUS_CODE_PERMANENT_REDIRECT;
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
    else {
      const code = status || statusCode;
      yield fork(alert, `Unknown error ${code} T_T`);
    }
  }
}
