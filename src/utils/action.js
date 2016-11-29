export function createActionCreator(type) {
  return function actionCreator(payload) {
    return {
      type,
      payload,
    };
  };
}

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
