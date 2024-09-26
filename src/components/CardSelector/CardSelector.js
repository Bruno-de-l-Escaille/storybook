import React, { Component } from "react";
import styles from "./CardSelector.module.scss";
class CardSelector extends Component {
  render() {
    let { selectorsTab } = this.props;
    return (
      <div className={styles.ttpSelectorsTab}>
        {selectorsTab.map((selectorTab, key) => {
          let Icon = selectorTab.icon;
          return (
            <div
              className={styles.ttpSelector}
              key={key}
              onClick={() => selectorTab.onClick()}
            >
              <div className={styles.icon}>
                {" "}
                <Icon />
              </div>
              <div className={styles.labels}>
                <h5>{selectorTab.name}</h5>
                <h3>{selectorTab.label}</h3>
                <p>{selectorTab.description}</p>
              </div>
              <div className={styles.ellipse} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default CardSelector;
