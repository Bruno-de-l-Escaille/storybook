import React, { Component } from "react";
import styles from "./Bubbles.module.scss";
import classnames from "classnames";

class Bubbles extends Component {
  selectTab = (ev, tabId) => {
    ev.preventDefault();
    this.props.selectTab(tabId);
  };
  render() {
    let { tabs, onBubbleClick, ButtonType = "primary", activeTab } = this.props;
    return (
      <div className={styles.campaignbubbles}>
        {tabs.map((tab) => {
          return (
            <div
              key={tab.id}
              className={classnames(
                styles.bubblediv,
                activeTab === tab.id ? styles.active : "",
                styles[ButtonType]
              )}
              onClick={(ev) => this.selectTab(ev, tab.id)}
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
