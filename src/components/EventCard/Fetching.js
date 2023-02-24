import classNames from "classnames";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./EventCard.module.scss";

export const Fetching = ({ expert }) => {
  const renderCard = () => {
    return (
      <div className={classNames(styles.event, expert ? styles.expert : "")}>
        <div className={styles.eventContent}>
          <div>
            <Skeleton height={130} />
          </div>

          <div className={styles.actions}>
            <div>
              <Skeleton height={22} width={44} />
            </div>

            <div style={{ marginLeft: "5px" }}>
              <Skeleton height={22} width={54} />
            </div>
          </div>

          <Skeleton height={49} width="100%" />

          <div style={{ marginTop: "3px" }}>
            <Skeleton height={13} width={100} />
          </div>
          <div style={{ marginTop: "7px" }}>
            <Skeleton height={14} width={213} />
          </div>
          <div style={{ marginTop: "5px" }}>
            <Skeleton height={28} width="100%" />
          </div>
          {!expert && (
            <div style={{ marginTop: "5px" }}>
              <Skeleton height={14} width={182} />
            </div>
          )}

          {!expert && (
            <div className={styles.controls} style={{ width: "100%" }}>
              <Skeleton height={30} width={115} />
              <Skeleton height={30} width={115} />
            </div>
          )}
        </div>
      </div>
    );
  };
  return renderCard();
};
