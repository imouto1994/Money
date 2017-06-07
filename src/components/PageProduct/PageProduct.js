import React, { PureComponent } from "react";

import Link from "../Link";
import PageHome from "../PageHome";

import commonStyles from "../../styles/common.css";
import styles from "./PageProduct.css";

/**
 * Component to represent page of a listing
 */
class PageProduct extends PureComponent {
  /**
   * Handler when component is mounted
   */
  componentDidMount() {
    PageHome.preload();
  }

  /**
   * Main render function
   * @return {JSXElement}
   */
  render() {
    return (
      <div className={`${styles.container} ${commonStyles.block}`}>
        <h1 className={styles.header}>
          PRODUCT
        </h1>
        <div className={styles.links}>
          <Link href="/" className={styles.link}>
            HOME PAGE
          </Link>
        </div>
      </div>
    );
  }
}

export default PageProduct;
