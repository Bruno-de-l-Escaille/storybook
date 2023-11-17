import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./Button.module.scss";

export default class Button extends React.PureComponent {
  static propTypes = {
    variant: PropTypes.oneOf([
      "primary",
      "secondary",
      "success",
      "danger",
      "warning",
      "info",
      "default",
    ]),
    size: PropTypes.oneOf(["sm", "lg"]),
    block: PropTypes.bool,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(["button", "reset", "submit"]),
  };

  static defaultProps = {
    variant: "primary",
    active: false,
    disabled: false,
    type: "button",
  };

  render() {
    const prefix = "btn";

    const {
      variant,
      size,
      active,
      className,
      block,
      type,
      icon,
      ...props
    } = this.props;

    const classes = classNames(
      className,
      styles[prefix],
      active && styles["active"],
      styles[`${prefix}-${variant}`],
      block && styles[`${prefix}-block`],
      size && styles[`${prefix}-${size}`]
    );

    return (
      <button {...props} type={type} className={classes}>
        {icon && <i className={`${styles["btn-icon"]} icon-${icon}`} />}
        {this.props.children}
      </button>
    );
  }
}
