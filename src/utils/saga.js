import get from "lodash/get";

import { identity } from "./function";

const BLOCK_EFFECT_TYPES = ["TAKE", "CALL", "APPLY", "CPS", "JOIN", "CANCEL", "FLUSH", "CANCELLED", "RACE"];

export function isPutEffectWithAction(effect, type) {
  return get(effect, ["PUT", "action", "type"]) === type;
}

export function isBlockEffect(effect) {
  return BLOCK_EFFECT_TYPES.map(type => !!effect[type]).filter(identity).length > 0;
}
