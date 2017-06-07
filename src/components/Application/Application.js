import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Map } from "immutable";

/**
 * Main component for the whole application
 * This will be the top-level component to be connected with external data such as Redux Store
 */
class Application extends PureComponent {
  static propTypes = {
    routeComponent: PropTypes.func,
  };

  static defaultProps = {
    routeComponent: undefined,
    routeName: undefined,
    chunkScripts: new Map(),
  };

  /**
   * Main render function
   * @return {JSXElement}
   */
  render() {
    const { routeComponent: RouteComponent } = this.props;

    // Selected component for display in this current route
    if (RouteComponent != null) {
      return (
        <div>
          <RouteComponent />
        </div>
      );
    } else {
      // Placeholder when no component is selected
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}

export default Application;
