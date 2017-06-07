import { connect } from "react-redux";

import Application from "./Application";
import {
  routeNameSelector,
  routeComponentSelector,
} from "../../selectors/RouteSelectors";

/**
 * Selectors from Redux Store for `Application` component
 * @param {ReduxStore} store
 * @return {Object}
 */
function selectFromStore(store) {
  return {
    routeComponent: routeComponentSelector(store),
    routeName: routeNameSelector(store),
  };
}

export default connect(selectFromStore)(Application);
