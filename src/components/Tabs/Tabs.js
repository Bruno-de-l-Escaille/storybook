import React, { Component } from "react";
import styles from "./Tabs.module.scss";
import classnames from "classnames";

class Tabs extends Component {
  selectTab = (ev, tabId) => {
    ev.preventDefault();
    this.props.selectTab(tabId);
  };
  render() {
    let {
      tabs,
      activeTab = tabs[0]["id"],
      type,
      ButtonType = "primary",
    } = this.props;
    let theme = "theme";
    return (
      <div
        className={classnames(
          styles.tabs,
          type === "simple" ? styles.simple : styles.notsimple
        )}
      >
        <nav>
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                className={`${
                  activeTab === tab.id
                    ? styles[ButtonType]
                    : styles[theme + ButtonType]
                }`}
                onClick={(ev) => this.selectTab(ev, tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }
}

export default Tabs;
