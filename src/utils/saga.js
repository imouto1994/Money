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
