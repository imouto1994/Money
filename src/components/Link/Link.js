import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { push } from "../../actions/RouteActions";

class Link extends PureComponent {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onClick: undefined,
  };

  onClick = e => {
    e.preventDefault();
    const { dispatch, onClick, href } = this.props;

    if (typeof onClick === "function") {
      onClick(e);
    }

    dispatch(push(href));
  };

  render() {
    const { href, children } = this.props;

    return (
      <a href={ href } target="_self" onClick={ this.onClick }>
        { children }
      </a>
    );
  }
}

export default Link;
