import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import { AppContainer } from "react-hot-loader";

import Application from "../Application";
import { serverDateSelector } from "../../selectors/ApplicationSelectors";
import { BROWSER, NODE_ENV } from "../../Config";

class Root extends PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  };

  render() {
    if (BROWSER && NODE_ENV === "development") {
      return (
        <AppContainer>
          { this.renderMain() }
        </AppContainer>
      );
    }

    return this.renderMain();
  }

  renderMain() {
    const { store, locale, messages } = this.props;

    return (
      <IntlProvider
        initialNow={ serverDateSelector(store.getState()) }
        locale={ locale }
        messages={ messages }
      >
        <Provider store={ store }>
          <Application />
        </Provider>
      </IntlProvider>
    );
  }
}

export default Root;
