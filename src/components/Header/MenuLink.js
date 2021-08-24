import React, { Component } from "react";
import * as icons from "../Icons";
import styles from "./Header.module.scss";

class MenuLink extends Component {
  render() {
    const { href, icon, className = "", children } = this.props;
    const Icon = icons[icon];

    return (
      <li className={`${styles.buttonLink}`}>
        <a href={href && href}>
          <Icon /> {children}
        </a>
      </li>
    );
  }
}

export default MenuLink;
