import Fetchr from "fetchr";

/**
 * API Routes
 * @param {Application} app
 * @return {Promise}
 */
export default function (app) {
  // Register Fetchr Services


  // Register Fetchr Middleware
  app.use("/ui/iso", Fetchr.middleware());
}
