const pick = require("lodash/pick");

/* Environment Variables */
const {
  BROWSER,
} = process.env;

const CommonConfig = [
  "NODE_ENV",
  "BROWSER",
];
const ClientConfig = [];
const ServerConfig = [
  "SERVER_HOST",
  "SERVER_PORT",
];

function createConfig(isBrowser) {
  let config;
  if (isBrowser) {
    config = pick(
      process.env,
      [
        ...CommonConfig,
        ...ClientConfig,
      ],
    );
  }
  else {
    config = pick(
      process.env,
      [
        ...CommonConfig,
        ...ServerConfig,
      ],
    );
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
