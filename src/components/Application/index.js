import { connect } from "react-redux";

import Application from "./Application";
import { getRouteName, getRouteComponent } from "../../selectors/RouteSelectors";

function selectFromStore(store) {
  return {
    routeComponent: getRouteComponent(store),
    routeName: getRouteName(store),
  };
}

export default connect(selectFromStore)(Application);
