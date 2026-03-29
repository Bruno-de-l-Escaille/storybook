import React, { Component } from "react";
import styles from "./PageHeader.module.scss";
import classnames from "classnames";

class PageHeader extends Component {
  render() {
    const { header, subHeader, Icon, buttons = [] } = this.props;
    return (
      <div className={styles.pageHeader}>
        <div className={styles.pageHeader__icon}>
          <Icon width="45" height="45" />
        </div>
        <div className={styles.pageHeader__info}>
          <div>
            <h3>{header}</h3>
            <p>{subHeader}</p>
          </div>
        </div>
        <div className={styles.pageHeader__children}>
          {buttons.map((button) => {
            return (
              <button
                className={classnames(styles.btn, styles[button.style])}
                onClick={button.onClick}
              >
                {button.Icon && <button.Icon />}
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
}
export default PageHeader;
