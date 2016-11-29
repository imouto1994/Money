import qs from "qs";

export function parseQueryString(str) {
  let queryString = str;
  if (queryString.indexOf("?") === 0) {
    queryString = queryString.slice(1);
  }

  return qs.parse(queryString);
}
