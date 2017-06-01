/**
 * [createHttpError description]
 * @param {[type]} statusCode [description]
 * @return {[type]} [description]
 */
export function createHttpError(statusCode) {
  const err = new Error();
  err.status = statusCode;
  err.statusCode = statusCode;

  return err;
}
