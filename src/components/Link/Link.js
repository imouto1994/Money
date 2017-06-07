import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { push } from "../../actions/RouteActions";

// TODO: Improve 'Link' behavior
/**
 * Component acts as link in application. This will allow app to perform client-side transition
 * instead of original server side transition
 */
class Link extends PureComponent {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    onClick: undefined,
    className: undefined,
  };

  /**
   * Handler when user clicks on the link
   * @param {SyntheticEvent} e
   */
  onClick = e => {
    e.preventDefault();
    const { dispatch, onClick, href } = this.props;

    if (typeof onClick === "function") {
      onClick(e);
    }

    dispatch(push(href));
  };

  /**
   * Main render function
   * @return {JSXElement}
   */
  render() {
    const { href, className, children } = this.props;

    return (
      <a
        href={href}
        target="_self"
        onClick={this.onClick}
        className={className}
      >
        {children}
      </a>
    );
  }
}

export default Link;
