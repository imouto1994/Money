import { createHttpError } from "../utils/error";
import { makeRequest } from "../utils/request";
import { BACKEND_API_URL } from "../Config";

/**
 * Generic handler to send request from server
 * @param {Request} req - request sent to server
 * @param {String} url
 * @param {Object} options
 * @param {Boolean} requireAuth
 * @param {Function} callback
 * @return {Promise}
 */
function _send(req, url, options, requireAuth, callback) {
  if (require && !req.user) {
    return callback(createHttpError(401));
  } else {
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
   * READ operation for this service
   * @param {Request} req
   * @param {Object} resource
   * @param {Object} params
   * @param {Object} config
   * @param {Function} callback
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
   * CREATE operation for this service
   * @param {Request} req
   * @param {Object} resource
   * @param {Object} params
   * @param {Object} body
   * @param {Object} config
   * @param {Function} callback
   */
  create(req, resource, params, body, config, callback) {
    const {
      path,
      query,
      data,
      files,
      headers = {},
      useForm = false,
      requireAuth = false,
    } = params;
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
   * UPDATE operation for this service
   * @param {Request} req
   * @param {Object} resource
   * @param {Object} params
   * @param {Object} body
   * @param {Object} config
   * @param {Function} callback
   */
  update(req, resource, params, body, config, callback) {
    const {
      path,
      query,
      data,
      files,
      headers = {},
      useForm = false,
      requireAuth = false,
    } = params;
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
   * DELETE operation for this service
   * @param {Request} req
   * @param {Object} resource
   * @param {Object} params
   * @param {Object} config
   * @param {Function} callback
   */
  delete(req, resource, params, config, callback) {
    const {
      path,
      query,
      data,
      headers = {},
      useForm = false,
      requireAuth = false,
    } = params;
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
};
