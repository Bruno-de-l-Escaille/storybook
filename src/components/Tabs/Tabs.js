import React, { Component } from "react";
import styles from "./Tabs.module.scss";
import classnames from "classnames";

class Tabs extends Component {

  selectTab = (ev, tabId) => {
    ev.preventDefault();
    this.props.selectTab(tabId);
  }

  render() {
    const { tabs, activeTab, type } = this.props;

    return (
      <div className={styles.tabs}>
        <div className={styles.tabItem}>
          <nav>
            {tabs.map(tab => {
              return (
                <button key={tab.id} href="#" className={`${activeTab == tab.id ? "active" : ""}`} onClick={(ev) => this.selectTab(ev, tab.id)}>
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    )
  }
}

export default Tabs;