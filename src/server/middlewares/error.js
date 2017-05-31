import { log } from "../../utils/log";

/* eslint-disable no-unused-vars */
/**
 * Middleware to handle generic error
 */
export function errorHandler(err, req, res, next) {
  if (err != null) {
    log(`Error on request ${req.method} ${req.url}`);
    log(err);
    log(err.stack);

    res.status(500)
      .send("Sorry, we are facing some problems with the website. Please try again later.");
  }
}
