import { Map } from "immutable";

const initialState = new Map({
  instance: undefined,
});

export default function fetchrReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    default:
      return state;
  }
}
