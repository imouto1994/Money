import React, { PureComponent } from "react";

import PageProduct from "../PageProduct";
import Link from "../Link";

class PageHome extends PureComponent {
  componentDidMount() {
    PageProduct.preload();
  }

  render() {
    return (
      <div>
        <h1>
          Home
        </h1>
        <div>
          <Link href="/p/123">
            PRODUCT PAGE
          </Link>
        </div>
      </div>
    );
  }
}

export default PageHome;
