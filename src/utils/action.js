/**
 * Create an action creator which passes its first argument as payload
 * @param {String} type - action type
 * @return {Function}
 */
export function createActionCreator(type) {
  return function actionCreator(payload, err) {
    return {
      type,
      payload,
      err,
    };
  };
}

/**
 * Create an action creator which passes all its arguments as payload under an array
 * @param {String} type - action type
 * @return {Function}
 */
export function createActionCreatorFromArgs(type) {
  return function actionCreator(...args) {
    return {
      type,
      payload: [
        ...args,
      ],
    };
  };
}
