import React from "react";
import Loadable from "react-loadable";

import { BROWSER } from "../../Config";

let path;
if (!BROWSER) {
  // eslint-disable-next-line global-require
  path = require("path");
}

export const loader = () => import("./PageProduct");

export default Loadable({
  loader,
  LoadingComponent: () => <div />,
  serverSideRequirePath: !BROWSER ? path.join(__dirname, "./PageProduct") : undefined,
});
