/**
 * Middleware to block bot if hostname is not defined
 */
export default function (req, res, next) {
  if (req.hostname === undefined) {
    res.sendStatus(400);
  }
  else {
    next();
  }
}
