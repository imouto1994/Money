import React, { PureComponent } from "react";

import Link from "../Link";
import PageHome from "../PageHome";

class PageProduct extends PureComponent {
  componentDidMount() {
    PageHome.preload();
  }

  render() {
    return (
      <div>
        <h1>
          PRODUCT
        </h1>
        <div>
          <Link href="/">
            HOME PAGE
          </Link>
        </div>
      </div>
    );
  }
}

export default PageProduct;
