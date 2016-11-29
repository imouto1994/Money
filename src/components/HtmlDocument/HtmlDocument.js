import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class HtmlDocument extends PureComponent {
  static propTypes = {
    titleComponent: PropTypes.node,
    metaComponents: PropTypes.node,
    linkComponents: PropTypes.node,
    scriptComponents: PropTypes.node,
    markup: PropTypes.string.isRequired,
    store: PropTypes.string.isRequired,
    webpackAssets: PropTypes.object,
  };

  static defaultProps = {
    titleComponent: undefined,
    webpackAssets: {},
    metaComponents: [],
    linkComponents: [],
    scriptComponents: [],
  };

  render() {
    const {
      markup,
      store,
      webpackAssets,
      titleComponent,
      metaComponents,
      linkComponents,
      scriptComponents,
    } = this.props;

    return (
      <html lang="en">
        <head>
          { titleComponent }
          { metaComponents }
          { linkComponents }
        </head>
        <body>
          { /* eslint-disable react/no-danger */ }
          <div id="root" dangerouslySetInnerHTML={ { __html: markup } } />
          <script dangerouslySetInnerHTML={ { __html: `window.__data=${store};` } } />
          { /* eslint-enable react/no-danger */ }
          { scriptComponents }
          <script src={ `${webpackAssets.main.js}` } />
        </body>
      </html>
    );
  }
}

export default HtmlDocument;
