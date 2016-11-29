/**
 * Middleware to handle health check request
 */
export default function (req, res) {
  res.send("Healthy Life!");
}
