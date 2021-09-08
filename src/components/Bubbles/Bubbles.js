import React, { Component } from "react";
import styles from "./Bubbles.module.scss";
import classnames from "classnames";

class Bubbles extends Component {
  render() {
    let { tabs, onBubbleClick, ButtonType = "primary" } = this.props;
    return (
      <div className={styles.campaignbubbles}>
        {tabs.map((tab) => {
          return (
            <div
              key={tab.id}
              className={classnames(
                styles.bubblediv,
                tab.isActive ? styles.active : "",
                styles[ButtonType]
              )}
              onClick={(ev) => onBubbleClick(tab.id)}
            >
              {tab.svg ? tab.svg : ""}
              <span className={styles.paddingleft}>{tab.label}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Bubbles;
