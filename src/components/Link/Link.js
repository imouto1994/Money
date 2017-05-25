import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Link extends PureComponent {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { href, children } = this.props;

    return (
      <a href={ href }>
        { children }
      </a>
    );
  }
}

export default Link;
