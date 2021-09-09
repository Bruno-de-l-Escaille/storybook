import React, { Component } from "react";
import styles from "./Button.module.scss";
import classnames from "classnames";
import IconLoader from "../Icons/IconLoader";

class Button extends Component {
  render() {
    const {
      inProcess,
      variant = "primary",
      children,
      Icon,
      classes,
      ...args
    } = this.props;
    return (
      <button
        className={classnames(styles.button, styles[variant], classes)}
        onClick={args.click}
      >
        {Icon && <Icon />}
        {inProcess ? <IconLoader /> : children}
      </button>
    );
  }
}

export default Button;
