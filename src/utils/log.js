import debug from "debug";

import DebugEnvs from "../constants/DebugEnvs";
import { BROWSER } from "../Config";

const DEFAULT_DEBUG_ENV = BROWSER ? DebugEnvs.CLIENT : DebugEnvs.SERVER;
export function log(str, debugEnv = DEFAULT_DEBUG_ENV) {
  debug(debugEnv)(str);
}
