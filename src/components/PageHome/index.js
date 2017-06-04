import React from "react";
import Loadable from "react-loadable";

import { BROWSER } from "../../Config";

let path;
if (!BROWSER) {
  // eslint-disable-next-line global-require
  path = require("path");
}

export default Loadable({
  loader: () => import("./PageHome"),
  LoadingComponent: () => <div />,
  serverSideRequirePath: !BROWSER ? path.join(__dirname, "./PageHome") : undefined,
  webpackRequireWeakId: () => require.resolveWeak("./PageHome"),
});
