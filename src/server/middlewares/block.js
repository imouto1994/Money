/**
 * Middleware to block bot if hostname is not defined
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next - callback to pass to the next middleware
 */
export function blockBot(req, res, next) {
  if (req.hostname === undefined) {
    res.sendStatus(400);
  } else {
    next();
  }
}
