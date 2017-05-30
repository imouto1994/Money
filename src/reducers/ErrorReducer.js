import { Map } from "immutable";

import {
  ROUTE_CHANGE_COMPONENT,
  ERROR_ADD,
  ERROR_REMOVE,
} from "../constants/Actions";

const initialState = new Map({
  errorsMap: new Map(),
});

export default function errorReducer(state = initialState, action) {
  const { type, payload, err } = action;
  switch (type) {
    // Clear error store if route is changed
    case ROUTE_CHANGE_COMPONENT: {
      return state.update("errorsMap", map => map.clear());
    }
    case ERROR_ADD: {
      const { key } = payload;
      return state.updateIn(["errorsMap", key], err);
    }
    case ERROR_REMOVE: {
      const { key } = payload;
      return state.deleteIn(["errorsMap", key]);
    }
    default: {
      if (err != null) {
        return state.setIn(["errorsMap", type], err);
      }
      else {
        return state;
      }
    }
  }
}
