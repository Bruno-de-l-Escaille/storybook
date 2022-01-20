import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "../UserCard/UserCard.module.scss";

export const Fetching = ({ theme }) => {
  const renderCard = () => {
    return (
      <div className={`${styles.userCard} ${styles[theme]}`}>
        <div className={styles.avatar}>
          <Skeleton width={156} height={156} circle={true} />
        </div>
        <div className={styles.header}>
          <h3>
            <Skeleton width={120} />
          </h3>

          <h5>
            <Skeleton width={80} />
            <Skeleton width={80} />
          </h5>
        </div>
      </div>
    );
  };
  if (theme === "dark")
    return (
      <SkeletonTheme color="#29394d" highlightColor="#485463">
        {renderCard()}
      </SkeletonTheme>
    );
  else return renderCard();
};
