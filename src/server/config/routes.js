import Fetchr from "fetchr";

/**
 * API Routes
 * @param {Express} app
 */
export default function(app) {
  // TODO: Register Fetchr Services

  // Register Fetchr Middleware
  app.use("/ui/iso", Fetchr.middleware());
}
