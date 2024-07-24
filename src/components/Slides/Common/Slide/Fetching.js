import React from "react";
import styles from "./Slide.module.scss";
import classNames from "classnames";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Fetching = () => {
  return (
    <SkeletonTheme highlightColor="#29394db2" baseColor="#fff">
      <div className={classNames(styles.wrapper, styles.fetching)}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div className={styles.titles}>
              <Skeleton width={167} height={23} />
              <Skeleton width={500} height={28} count={2} />
            </div>
            <div>
              <Skeleton width={76} height={46} />
            </div>
          </div>
          <div className={styles.body}>
            <Skeleton
              width={36}
              height={36}
              count={3}
              circle
              inline
              style={{ marginRight: "30px" }}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Skeleton
            width={207}
            height={43}
            borderRadius={8}
            count={2}
            inline
            style={{ marginRight: "10px" }}
          />
        </div>
      </div>
    </SkeletonTheme>
  );
};
