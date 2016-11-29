import express from "express";
import Promise from "bluebird";
import debug from "debug";
import ip from "ip";

import configureEnvironment from "./config/environment";
import configureRoutes from "./config/routes";
import configureRender from "./config/render";
import DebugEnvs from "../constants/DebugEnvs";
import { NODE_ENV, SERVER_PORT, ETHER_INTERFACE } from "../Config";

const log = debug(DebugEnvs.SERVER);
const app = express();

export default Promise
  .resolve()
  .then(() => {
    log(`Node Environment: ${NODE_ENV}`);
    log("Setting up environment...");
    return configureEnvironment(app);
  })
  .then(() => {
    log("Setting up routing...");
    return configureRoutes(app);
  })
  .then(() => {
    log("Setting up rendering...");
    return configureRender(app);
  })
  .then(() => {
    app.set("port", SERVER_PORT);
    app.listen(
      parseInt(SERVER_PORT, 10),
      NODE_ENV === "production" ? ip.address(ETHER_INTERFACE) : null,
    );
    log(`Server started at port ${SERVER_PORT}`);
  })
  .catch(err => {
    log(err);
    process.kill(process.pid, "SIGKILL");
  });
