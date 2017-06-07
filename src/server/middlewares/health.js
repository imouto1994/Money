/**
 * Middleware to handle health check request
 * @param {Request} req
 * @param {Response} res
 */
export function healthCheck(req, res) {
  res.send("Healthy Life!");
}
