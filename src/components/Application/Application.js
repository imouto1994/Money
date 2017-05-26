import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Map } from "immutable";

class Application extends PureComponent {
  static propTypes = {
    routeComponent: PropTypes.func,
  };

  static defaultProps = {
    routeComponent: undefined,
    routeName: undefined,
    chunkScripts: new Map(),
  };

  render() {
    const { routeComponent: RouteComponent } = this.props;

    // Selected component for display in this current route
    if (RouteComponent != null) {
      return (
        <div>
          <RouteComponent />
        </div>
      );
    }
    // Placeholder when no component is selected
    else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}

export default Application;
