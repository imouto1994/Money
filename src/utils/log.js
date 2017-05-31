import debug from "debug";

import { CLIENT, SERVER } from "../constants/DebugEnvs";
import { BROWSER } from "../Config";

const DEFAULT_DEBUG_ENV = BROWSER ? CLIENT : SERVER;
export function log(str, debugEnv = DEFAULT_DEBUG_ENV) {
  debug(debugEnv)(str);
}
