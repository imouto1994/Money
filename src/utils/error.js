/**
 * Create HTTP Error object
 * @param {String} statusCode
 * @return {Error}
 */
export function createHttpError(statusCode) {
  const err = new Error();
  err.status = statusCode;
  err.statusCode = statusCode;

  return err;
}
