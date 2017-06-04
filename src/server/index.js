import express from "express";
import Promise from "bluebird";
import ip from "ip";

import configureEnvironment from "./config/environment";
import configureRoutes from "./config/routes";
import configureRender from "./config/render";
import { polyfillServerIntl } from "../utils/intl";
import { NODE_ENV, SERVER_PORT, ETHER_INTERFACE } from "../Config";

const app = express();

export default Promise
  .resolve()
  .then(() => polyfillServerIntl())
  .then(() => {
    console.log(`Node Environment: ${NODE_ENV}`);
    console.log("Setting up environment...");
    return configureEnvironment(app);
  })
  .then(() => {
    console.log("Setting up routing...");
    return configureRoutes(app);
  })
  .then(() => {
    console.log("Setting up rendering...");
    return configureRender(app);
  })
  .then(() => {
    app.set("port", SERVER_PORT);
    app.listen(
      parseInt(SERVER_PORT, 10),
      NODE_ENV === "production" ? ip.address(ETHER_INTERFACE) : null,
    );
    console.log(`Server started at port ${SERVER_PORT}`);
  })
  .catch(err => {
    console.log(err);
    process.kill(process.pid, "SIGKILL");
  });
