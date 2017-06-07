import { fork, join, call } from "redux-saga/effects";
import get from "lodash/get";

import { identity } from "./function";

// List of effects which will block the flow of saga until the task under the effect is finished
const BLOCK_EFFECT_TYPES = [
  "TAKE",
  "CALL",
  "APPLY",
  "CPS",
  "JOIN",
  "CANCEL",
  "FLUSH",
  "CANCELLED",
  "RACE",
];

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
  return (
    BLOCK_EFFECT_TYPES.map(type => !!effect[type]).filter(identity).length > 0
  );
}

/**
 * Return a saga effect based on the given value
 * @param {*} value
 * @param {Boolean} isFork - indicator if we should use 'call' or 'fork' for the wrapper effect
 * @return {Effect}
 */
function getEffect(value, isFork = false) {
  const effect = isFork ? fork : call;
  if (value.constructor.name === "GeneratorFunction") {
    return effect(value);
  } else if (typeof value === "function") {
    return effect(function*() {
      yield call(value);
    });
  } else if (typeof value === "object") {
    // Saga Effect Descriptors or Promise
    return effect(function*() {
      yield value;
    });
  } else {
    throw new Error("Invalid value to create fork effect");
  }
}

const MAX_ITERATION_COUNT = 10;
/**
 * Execute a series of sagas with dependencies on each other
 * @param {Object} sagasMap
 * @return {GeneratorFunction}
 */
export function executeMultiple(sagasMap) {
  return function*() {
    const tasksMap = {};
    // Ensure that the upcoming loop will not go on forever
    let iteration = 0;
    /* eslint-disable no-restricted-syntax, no-prototype-builtins */
    while (
      iteration++ < MAX_ITERATION_COUNT &&
      Object.keys(tasksMap) !== Object.keys(sagasMap)
    ) {
      for (const key in sagasMap) {
        if (sagasMap.hasOwnProperty(key)) {
          if (tasksMap[key] != null) {
            continue;
          }
          const value = sagasMap[key];
          // Sagas with dependencies
          if (value instanceof Array) {
            const dependencies = value.slice(0, value.length - 1);
            let isDependenciesUnresolved = false;
            for (let i = 0, length = dependencies.length; i < length; i++) {
              if (tasksMap[dependencies[i]] == null) {
                isDependenciesUnresolved = true;
                break;
              }
            }
            // Skip if all the dependencies have not been executed
            if (isDependenciesUnresolved) {
              continue;
            } else {
              const saga = value[value.length - 1];
              const task = yield fork(function*() {
                yield join(
                  ...dependencies
                    .map(v => tasksMap[v])
                    .filter(t => t != null && t !== true)
                );
                yield getEffect(saga);
              });
              tasksMap[key] = task;
            }
          } else {
            // Sagas without dependencies
            const task = yield getEffect(value, true);
            tasksMap[key] = task;
          }
        }
      }
    }
  };
}
