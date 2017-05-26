import qs from "qs";

/* eslint-disable import/prefer-default-export */
/**
 * Parse query string into JS Object
 * @param {String} str
 * @return {Object}
 */
export function parseQueryString(str) {
  let queryString = str;
  if (queryString.indexOf("?") === 0) {
    queryString = queryString.slice(1);
  }

  return qs.parse(queryString);
}
