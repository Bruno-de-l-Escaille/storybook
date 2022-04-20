import React, { Component } from "react";
import styles from "./TabSlider.module.scss";
import classnames from "classnames";

class TabSlider extends Component {
  selectTab = (ev, tabId) => {
    ev.preventDefault();
    this.props.selectTab(tabId);
  };
  render() {
    let { tabs, activeTab = tabs[0]["label"] } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.tabslider}>
          {tabs.map((tab) => {
            return (
              <div
                className={classnames(
                  styles.item,
                  activeTab === tab.label ? styles.active : ""
                )}
                onClick={(ev) => this.selectTab(ev, tab.label)}
              >
                {tab.icon}
                <span> {tab.label} </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default TabSlider;
