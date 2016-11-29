import debug from "debug";

import DebugEnvs from "../../constants/DebugEnvs";

const log = debug(DebugEnvs.SERVER);

/**
 * Middleware to handle generic error
 */
export default function (err, req, res) {
  if (err != null) {
    log(`Error on request ${req.method} ${req.url}`);
    log(err);
    log(err.stack);

    res.status(500)
      .send("Sorry, we are facing some problems with the website. Please try again later.");
  }
}
