import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";

import Application from "../Application";

class Root extends PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
  };

  render() {
    const { store } = this.props;

    return (
      <Provider store={ store }>
        <Application />
      </Provider>
    );
  }
}

export default Root;
