import React, { Component } from "react";
import styles from "./Tabs.module.scss";
import classnames from "classnames";

class Tabs extends Component {

  selectTab = (ev, tabId) => {
    ev.preventDefault();
    this.props.selectTab(tabId);
    this.props.onChange(tabId);
  }

  render() {
    let { tabs, activeTab = tabs[0]["id"], type, chooseType="primary" } = this.props;

    return (
    <div className={classnames(styles.tabs,
          type === "simple" ? styles.simple : styles.notsimple
        )}
      >
        <nav>


          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                 href="#"
                className={`${activeTab == tab.id ?  styles[chooseType]  : ""}`}
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
