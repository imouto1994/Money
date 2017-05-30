import {
  ERROR_ADD,
  ERROR_REMOVE,
} from "../constants/Actions";
import { createActionCreator } from "../utils/action";

export const addError = createActionCreator(ERROR_ADD);
export const removeError = createActionCreator(ERROR_REMOVE);
