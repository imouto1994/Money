/**
 * Generic unexpected error handler middleware
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next - callback to pass the next middleware
 */
export function errorHandler(err, req, res, next) {
  if (err != null) {
    /* eslint-disable no-console */
    console.log(`Error on request ${req.method} ${req.url}`);
    console.log(err);
    console.log(err.stack);
    /* eslint-enable no-console */

    res
      .status(500)
      .send(
        "Sorry, we are facing some problems with the website. Please try again later."
      );
  }
}
