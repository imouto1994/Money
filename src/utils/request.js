import request from "superagent";

/**
 * Generic wrapper to make request to external server
 * @param {String} url
 * @param {Object} options
 * @return {Promise}
 */
export function makeRequest(url, options) {
  const { method, query, data, files, useForm, headers = {} } = options;
  const r = request[method](url);

  if (files != null) {
    files.forEach(file => {
      const fileBuffer = Buffer.from(file.src, "base64");
      r.attach(file.name, fileBuffer, file.name);
    });
  }

  if (data != null) {
    if (useForm) {
      r.type("form");
    }

    // Multi-part Request
    if (files != null) {
      r.field(data);
    } else {
      r.send(data);
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in headers) {
    // eslint-disable-next-line no-prototype-builtins
    if (headers.hasOwnProperty(key)) {
      r.set(key, headers[key]);
    }
  }

  if (query != null) {
    r.query(query);
  }

  return r.then(res => res.body).catch(err => {
    if (err.status != null) {
      // eslint-disable-next-line no-param-reassign
      err.statusCode = err.status;
    }
    return Promise.reject(err);
  });
}
