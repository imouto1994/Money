import React, { PureComponent } from "react";

import PageProduct from "../PageProduct";
import Link from "../Link";

import commonStyles from "../../styles/common.css";
import styles from "./PageHome.css";

/**
 * Component to represent home page of the application
 */
class PageHome extends PureComponent {
  /**
   * Handler when component is mounted
   */
  componentDidMount() {
    PageProduct.preload();
  }

  /**
   * Main render function
   * @return {JSXElement}
   */
  render() {
    return (
      <div className={`${styles.container} ${commonStyles.block}`}>
        <h1 className={styles.header}>
          Home
        </h1>
        <div className={styles.links}>
          <Link href="/p/123" className={styles.link}>
            PRODUCT PAGE
          </Link>
        </div>
      </div>
    );
  }
}

export default PageHome;
