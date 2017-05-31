/**
 * Middleware to handle health check request
 */
export function healthCheck(req, res) {
  res.send("Healthy Life!");
}
