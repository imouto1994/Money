import pick from "lodash/pick";

import { LOCALES_MAP, LOCALES } from "./locales";

/* Environment Variables */
const { BROWSER } = process.env;
const CommonConfig = {
  LOCALES,
  LOCALES_MAP,
  ...pick(process.env, ["NODE_ENV", "BROWSER", "DEBUG", "ASSETS_ROOT_URL"]),
};
const ClientConfig = {
  ...pick(process.env, []),
};
const ServerConfig = {
  ...pick(process.env, ["SERVER_HOST", "SERVER_PORT", "BACKEND_API_URL"]),
};

/**
 * Create config for application
 * @param {Boolean} isBrowser - indicator if environment is browser or not
 * @return {Object}
 */
function createConfig(isBrowser) {
  let config;
  if (isBrowser) {
    config = {
      ...CommonConfig,
      ...ClientConfig,
    };
  } else {
    config = {
      ...CommonConfig,
      ...ServerConfig,
    };
  }

  return {
    ...config,
    BROWSER: isBrowser,
  };
}

export default {
  ...createConfig(BROWSER),
  createConfig,
};
