import React, { PureComponent } from "react";

import PageProduct from "../PageProduct";
import Link from "../Link";

import styles from "./PageHome.css";

class PageHome extends PureComponent {
  componentDidMount() {
    PageProduct.preload();
  }

  render() {
    return (
      <div className={ styles.container }>
        <h1 className={ styles.header }>
          Home
        </h1>
        <div className={ styles.links }>
          <Link href="/p/123" className={ styles.link }>
            PRODUCT PAGE
          </Link>
        </div>
      </div>
    );
  }
}

export default PageHome;
