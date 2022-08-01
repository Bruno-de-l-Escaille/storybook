import React, { Component } from "react";
import classnames from "classnames";

import * as icons from "../Icons";
import styles from "./Header.module.scss";

class MenuLink extends Component {
  render() {
    const { href, icon, className = "", children } = this.props;
    const Icon = icons[icon];

    return (
      <li className={classnames(`${styles.buttonLink}`, className)}>
        <a href={href && href}>
          <Icon /> {children}
        </a>
      </li>
    );
  }
}

export default MenuLink;
