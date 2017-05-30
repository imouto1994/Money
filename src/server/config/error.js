import fetchrHandler from "../middlewares/fetchrHandler";
import errorHandler from "../middlewares/errorHandler";

/**
 * Setup error handlers for server application
 */
export default function (app) {
  app.use(fetchrHandler);
  app.use(errorHandler);
}
