import { createHttpError } from "../utils/error";
import { makeRequest } from "../utils/request";
import { BACKEND_API_URL } from "../Config";

function _send(req, url, options, requireAuth, callback) {
  if (require && !req.user) {
    return callback(createHttpError(401));
  }
  else {
    if (req.user) {
      // eslint-disable-next-line no-param-reassign
      options.headers.Authorization = `token ${req.user.token}`;
    }

    return makeRequest(url, options)
      .then(res => callback(null, res))
      .catch(err => callback(err));
  }
}

export default {
  name: "api",
  /**
   * [read description]
   * @param {[type]} req [description]
   * @param {[type]} resource [description]
   * @param {[type]} params [description]
   * @param {[type]} config [description]
   * @param {Function} callback [description]
   * @return {[type]} [description]
   */
  read(req, resource, params, config, callback) {
    const { path, query, headers = {}, requireAuth = false } = params;
    const url = `${BACKEND_API_URL}${path}`;
    const options = {
      method: "get",
      query,
      headers,
    };

    _send(req, url, options, requireAuth, callback);
  },
  /**
   * [create description]
   * @param {[type]} req [description]
   * @param {[type]} resource [description]
   * @param {[type]} params [description]
   * @param {[type]} body [description]
   * @param {[type]} config [description]
   * @param {Function} callback [description]
   * @return {[type]} [description]
   */
  create(req, resource, params, body, config, callback) {
    const { path, query, data, files, headers = {}, useForm = false, requireAuth = false } = params;
    const url = `${BACKEND_API_URL}${path}`;
    const options = {
      method: "post",
      data,
      files,
      query,
      useForm,
      headers,
    };

    _send(req, url, options, requireAuth, callback);
  },
  /**
   * [update description]
   * @param {[type]} req [description]
   * @param {[type]} resource [description]
   * @param {[type]} params [description]
   * @param {[type]} body [description]
   * @param {[type]} config [description]
   * @param {Function} callback [description]
   * @return {[type]} [description]
   */
  update(req, resource, params, body, config, callback) {
    const { path, query, data, files, headers = {}, useForm = false, requireAuth = false } = params;
    const url = `${BACKEND_API_URL}${path}`;
    const options = {
      method: "put",
      data,
      files,
      query,
      useForm,
      headers,
    };

    _send(req, url, options, requireAuth, callback);
  },
  /**
   * [delete description]
   * @param {[type]} req [description]
   * @param {[type]} resource [description]
   * @param {[type]} params [description]
   * @param {[type]} config [description]
   * @param {Function} callback [description]
   * @return {[type]} [description]
   */
  delete(req, resource, params, config, callback) {
    const { path, query, data, headers = {}, useForm = false, requireAuth = false } = params;
    const url = `${BACKEND_API_URL}${path}`;
    const options = {
      method: "del",
      data,
      query,
      useForm,
      headers,
    };

    _send(req, url, options, requireAuth, callback);
  },
}