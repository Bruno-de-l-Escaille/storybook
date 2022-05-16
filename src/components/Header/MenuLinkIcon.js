import React, { Component } from "react";

import styles from "./Header.module.scss";

class MenuLinkIcon extends Component {
  render() {
    const { href, iconUrl, children } = this.props;

    return (
      <li className={`${styles.buttonLinkImg}`}>
        <a href={href && href}>
          <img src={iconUrl} /> {children}
        </a>
      </li>
    );
  }
}

export default MenuLinkIcon;
