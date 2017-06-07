import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import { AppContainer } from "react-hot-loader";

import Application from "../Application";
import { serverDateSelector } from "../../selectors/ApplicationSelectors";

/**
 * Root element of the application where it will ask for connection to all external data
 */
class Root extends PureComponent {
  static propTypes = {
    store: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  };

  /**
   * Main render function, which might have content that only applies for development environment
   * such as hot-reload wrapper
   * @return {JSXElement}
   */
  render() {
    if (process.env.BROWSER && process.env.NODE_ENV === "development") {
      return (
        <AppContainer>
          {this.renderMain()}
        </AppContainer>
      );
    }

    return this.renderMain();
  }

  /**
   * Render all production elements
   * @return {JSXElement}
   */
  renderMain() {
    const { store, locale, messages } = this.props;

    return (
      <IntlProvider
        initialNow={serverDateSelector(store.getState())}
        locale={locale}
        messages={messages}
      >
        <Provider store={store}>
          <Application />
        </Provider>
      </IntlProvider>
    );
  }
}

export default Root;
