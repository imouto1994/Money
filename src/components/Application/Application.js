import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Application extends PureComponent {
  static propTypes = {
    pageComponent: PropTypes.func,
  };

  static defaultProps = {
    pageComponent: undefined,
  };

  render() {
    const { pageComponent: PageComponent } = this.props;

    if (PageComponent != null) {
      return (
        <PageComponent />
      );
    }
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
