import express from "express";
import Promise from "bluebird";

import configureEnvironment from "./config/environment";
import configureRoutes from "./config/routes";
import configureRender from "./config/render";
import { polyfillServerIntl } from "../utils/intl";
import { NODE_ENV, SERVER_PORT } from "../Config";

const app = express();

export default Promise.resolve()
  .then(() => polyfillServerIntl())
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`Node Environment: ${NODE_ENV}`);
    // eslint-disable-next-line no-console
    console.log("Setting up environment...");
    return configureEnvironment(app);
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Setting up routing...");
    return configureRoutes(app);
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Setting up rendering...");
    return configureRender(app);
  })
  .then(() => {
    app.set("port", SERVER_PORT);
    app.listen(parseInt(SERVER_PORT, 10), null);
    // eslint-disable-next-line no-console
    console.log(`Server started at port ${SERVER_PORT}`);
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log(err);
    process.kill(process.pid, "SIGKILL");
  });
