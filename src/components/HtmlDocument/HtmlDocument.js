import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import serialize from "serialize-javascript";
import get from "lodash/get";

class HtmlDocument extends PureComponent {
  static propTypes = {
    helmet: PropTypes.object.isRequired,
    markup: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    asyncChunks: PropTypes.array,
    webpackAssets: PropTypes.object,
  };

  static defaultProps = {
    asyncChunks: [],
    webpackAssets: {},
  };

  render() {
    const {
      markup,
      state,
      helmet,
      webpackAssets,
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
          <script dangerouslySetInnerHTML={ { __html: `window.__webpackAssets=${serialize(webpackAssets, { isJSON: true })};` } } />
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
    const { webpackAssets, asyncChunks } = this.props;
    const scripts = [
      { path: webpackAssets.js.manifest },
      { path: webpackAssets.js.vendor },
      ...asyncChunks
        .map(path => get(webpackAssets, ["modules", path]))
        .filter(f => f != null)
        .map(f => ({ path: f })),
      { path: webpackAssets.js.main },
    ];

    return scripts;
  }
}

export default HtmlDocument;
