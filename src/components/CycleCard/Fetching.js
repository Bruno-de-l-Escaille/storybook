import classNames from "classnames";
import React from "react";
import styles from "./CycleCard.module.scss";

export const Fetching = () => {
  const renderCard = () => {
    return (
      <div className={classNames(styles.loading, "p-m")}>
        <div className={styles.title}>
          <h6> </h6>
          <h3> </h3>
        </div>
      </div>
    );
  };
  return renderCard();
};
