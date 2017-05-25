import qs from "qs";

// eslint-disable-next-lint import/prefer-default-export
export function parseQueryString(str) {
  let queryString = str;
  if (queryString.indexOf("?") === 0) {
    queryString = queryString.slice(1);
  }

  return qs.parse(queryString);
}
