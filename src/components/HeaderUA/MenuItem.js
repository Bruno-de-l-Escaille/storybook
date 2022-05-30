import React, { Component } from "react";
import * as icons from "../Icons";
import styles from "./Header.module.scss";

class MenuItem extends Component {
  render() {
    const { href, icon, className = "", children } = this.props;
    const Icon = icons[icon];

    return (
      <li className={`${styles.socialLinks} ${className}`}>
        <a href={href && href}>
          <Icon />
        </a>
        {children}
      </li>
    );
  }
}

export default MenuItem;
