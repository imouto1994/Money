import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import serialize from "serialize-javascript";
import get from "lodash/get";

class HtmlDocument extends PureComponent {
  static propTypes = {
    helmet: PropTypes.object.isRequired,
    markup: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    asyncModules: PropTypes.array,
    webpackAssets: PropTypes.object,
  };

  static defaultProps = {
    asyncModules: [],
    webpackAssets: {},
  };

  render() {
    const {
      markup,
      state,
      helmet,
    } = this.props;

    return (
      <html lang="en">
        <head>
          { helmet.title.toComponent() }
          { helmet.meta.toComponent() }
          { helmet.link.toComponent() }
        </head>
        <body>
          { /* eslint-disable react/no-danger, max-len */ }
          <div id="root" dangerouslySetInnerHTML={ { __html: markup } } />
          <script dangerouslySetInnerHTML={ { __html: `window.__data=${serialize(state, { isJSON: true })};` } } />
          { /* eslint-enable react/no-danger, max-len */ }
          { helmet.script.toComponent() }
          {
            this
              .getApplicationScripts()
              .map((script, i) => <script key={ i } async={ script.async } src={ script.path } />)
          }
        </body>
      </html>
    );
  }

  getApplicationScripts() {
    const { webpackAssets, asyncModules } = this.props;
    const scripts = [
      { path: webpackAssets.scripts.manifest },
      { path: webpackAssets.scripts.vendor },
      ...asyncModules
        .map(module => get(webpackAssets, ["modules", module]))
        .filter(asset => asset != null)
        .filter((asset, i, arr) => arr.indexOf(asset) === i)
        .map(asset => ({ path: asset })),
      { path: webpackAssets.scripts.main },
    ];

    return scripts;
  }
}

export default HtmlDocument;
