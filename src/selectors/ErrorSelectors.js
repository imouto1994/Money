import { List } from "immutable";
import { createSelector } from "reselect";

const errorsMapSelector = store => store.Error.get("errorsMap");
const errorsSelector = createSelector(errorsMapSelector, map =>
  map.reduce((l, error) => (error != null ? l.push(error) : l), new List())
);
const errorSelector = createSelector(errorsSelector, errors => errors.get(0));

export { errorSelector };
