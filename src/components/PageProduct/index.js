import React from "react";
import Loadable from "react-loadable";

import { BROWSER } from "../../Config";

let path;
if (!BROWSER) {
  // eslint-disable-next-line global-require
  path = require("path");
}

export default Loadable({
  loader: () => import("./PageProduct"),
  LoadingComponent: () => <div />,
  serverSideRequirePath: !BROWSER ? path.join(__dirname, "./PageProduct") : undefined,
  webpackRequireWeakId: BROWSER ? () => require.resolveWeak("./PageProduct") : undefined,
});
