import { combineReducers } from "redux";

import RouteReducer from "./RouteReducer";

const reducers = combineReducers({
  Route: RouteReducer,
});

export default reducers;
