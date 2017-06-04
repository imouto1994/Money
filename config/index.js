import pick from "lodash/pick";

import { LOCALES_MAP, LOCALES } from "./locales";

/* Environment Variables */
const {
  BROWSER,
} = process.env;

const CommonConfig = {
  LOCALES,
  LOCALES_MAP,
  ...pick(
    process.env,
    [
      "NODE_ENV",
      "BROWSER",
      "DEBUG",
    ],
  ),
};
const ClientConfig = {
  ...pick(
    process.env,
    [],
  ),
};
const ServerConfig = {
  ...pick(
    process.env,
    [
      "SERVER_HOST",
      "SERVER_PORT",
      "BACKEND_API_URL",
    ],
  ),
};

function createConfig(isBrowser) {
  let config;
  if (isBrowser) {
    config = {
      ...CommonConfig,
      ...ClientConfig,
    };
  }
  else {
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
