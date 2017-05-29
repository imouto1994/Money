import { fork, join } from "redux-saga/effects";
import get from "lodash/get";

import { identity } from "./function";

// List of effects which will block the flow of saga until the task under the effect is finished
const BLOCK_EFFECT_TYPES = ["TAKE", "CALL", "APPLY", "CPS", "JOIN", "CANCEL", "FLUSH", "CANCELLED", "RACE"];

/**
 * Check if the effect is PUT effect to dispatch an action with specified type
 * @param {Effect} effect
 * @param {String} type
 * @return {Boolean}
 */
export function isPutEffectWithAction(effect, type) {
  return get(effect, ["PUT", "action", "type"]) === type;
}

/**
 * Check if the effect is one of the block effect
 * @param {Effect} effect
 * @return {Boolean}
 */
export function isBlockEffect(effect) {
  return BLOCK_EFFECT_TYPES
    .map(type => !!effect[type])
    .filter(identity)
    .length > 0;
}

export function* executeMultiple(sagasMap) {
  const tasksMap = {};
  while (Object.keys(tasksMap) !== Object.keys(sagasMap)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in sagasMap) {
      // eslint-disable-next-line no-prototype-builtins
      if (sagasMap.hasOwnProperty(key)) {
        const value = sagasMap[key];
        if (value instanceof Array) {
          const dependencies = value.slice(0, value.length - 1);
          let isDependenciesUnresolved = false;
          for (let i = 0, length = dependencies.length; i < length; i++) {
            if (tasksMap[dependencies[i]] == null) {
              isDependenciesUnresolved = true;
              break;
            }
          }
          if (isDependenciesUnresolved) {
            continue;
          }
          else {
            const saga = value[value.length - 1];
            const task = yield fork(function* sagaWithDependencies() {
              yield join(dependencies.map(v => tasksMap[v]));
              yield fork(saga);
            });
            tasksMap[key] = task;
          }
        }
        else if (typeof value === "function") {
          const task = yield fork(value);
          tasksMap[key] = task;
        }
      }
    }
  }
}
