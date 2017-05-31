import { connect } from "react-redux";

import Application from "./Application";
import { routeNameSelector, routeComponentSelector } from "../../selectors/RouteSelectors";

function selectFromStore(store) {
  return {
    routeComponent: routeComponentSelector(store),
    routeName: routeNameSelector(store),
  };
}

export default connect(selectFromStore)(Application);
