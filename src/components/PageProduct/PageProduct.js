import React, { PureComponent } from "react";

import Link from "../Link";
import PageHome from "../PageHome";

import styles from "./PageProduct.css";

class PageProduct extends PureComponent {
  componentDidMount() {
    PageHome.preload();
  }

  render() {
    return (
      <div className={ styles.container }>
        <h1 className={ styles.header }>
          PRODUCT
        </h1>
        <div className={ styles.links }>
          <Link href="/" className={ styles.link }>
            HOME PAGE
          </Link>
        </div>
      </div>
    );
  }
}

export default PageProduct;
