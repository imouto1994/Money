import {
  ROUTE_CHANGE_COMPONENT,
  ROUTE_UPDATE_PATH,
  ROUTE_HISTORY_PUSH,
  ROUTE_HISTORY_REPLACE,
  ROUTE_HISTORY_GO,
  ROUTE_HISTORY_GO_BACK,
  ROUTE_HISTORY_GO_FORWARD,
} from "../constants/Actions";
import { createActionCreator, createActionCreatorFromArgs } from "../utils/action";

export const changeComponent = createActionCreator(ROUTE_CHANGE_COMPONENT);
export const updatePath = createActionCreator(ROUTE_UPDATE_PATH);
export const push = createActionCreatorFromArgs(ROUTE_HISTORY_PUSH);
export const replace = createActionCreatorFromArgs(ROUTE_HISTORY_REPLACE);
export const go = createActionCreatorFromArgs(ROUTE_HISTORY_GO);
export const goBack = createActionCreatorFromArgs(ROUTE_HISTORY_GO_BACK);
export const goForward = createActionCreatorFromArgs(ROUTE_HISTORY_GO_FORWARD);
