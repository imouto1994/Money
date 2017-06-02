import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import serialize from "serialize-javascript";
import get from "lodash/get";

class HtmlDocument extends PureComponent {
  static propTypes = {
    csrf: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
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
      csrf,
      lang,
      markup,
      state,
      helmet,
      webpackAssets,
    } = this.props;

    return (
      <html lang={ lang } data-lang-file={ get(webpackAssets, ["translations", lang]) } >
        <head>
          { helmet.title.toComponent() }
          { helmet.meta.toComponent() }
          { helmet.link.toComponent() }
        </head>
        <body>
          { /* eslint-disable react/no-danger, max-len */ }
          <div id="root" dangerouslySetInnerHTML={ { __html: markup } } />
          <script dangerouslySetInnerHTML={ { __html: `window.__data = ${serialize(state, { isJSON: true })};` } } />
          <script dangerouslySetInnerHTML={ { __html: `window._csrf = "${csrf}";` } } />
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
      ...webpackAssets.scripts.manifest.map(path => ({ path })),
      ...webpackAssets.scripts.vendor.map(path => ({ path })),
      ...asyncModules
        .map(module => get(webpackAssets, ["modules", module]))
        .filter(asset => asset != null)
        .filter((asset, i, arr) => arr.indexOf(asset) === i)
        .map(asset => ({ path: asset })),
      ...webpackAssets.scripts.main.map(path => ({ path })),
    ];

    return scripts;
  }
}

export default HtmlDocument;
