import { Map } from "immutable";

const initialState = new Map({
  serverDate: Date.now(),
});

export default function applicationReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    default:
      return state;
  }
}
