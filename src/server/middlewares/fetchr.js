// TODO: Update this handler
/**
 * Middleware to handle `fetchr` error
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next - callback to pass to the next middleware
 */
export function fetchrHandler(err, req, res, next) {
  if (err != null) {
    if (err.code === "EBADCSRFTOKEN") {
      // Handle CSRF token errors here
      res.status(403);
      res.send("Sorry, we cannot verify your request. Please try again later.");
    } else if (
      err.source === "fetchr" ||
      err.message === "Invalid Fetchr Access"
    ) {
      // Invalid `fetchr` access
      res.sendStatus(404);
    } else {
      next(err);
    }
  }
}
