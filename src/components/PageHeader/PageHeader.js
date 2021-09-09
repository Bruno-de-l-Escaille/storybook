import React, { Component } from "react";
import styles from "./PageHeader.module.scss";
import Button from "../Button/Button";
import classnames from "classnames";

class PageHeader extends Component {
  render() {
    const { header, subHeader, Icon, buttons = [] } = this.props;
    console.log("dddddddd", styles.Icon);
    return (
      <div className={styles.pageHeader}>
        <div className={styles.pageHeader__icon}>
          <Icon className={styles.Icon} width="45" height="45" />
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
              <Button classes={classnames(styles.btn, styles[button.style])} Icon={button.Icon} click={button.onClick}>
                {button.label}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }
}
export default PageHeader;
