import cn from "classnames";
import React from "react";
import styles from "./CycleCard.module.scss";
import Presential2Icon from "./assets/IconPresential2";
import CalendarIcon from "./assets/IconCalendar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export const Fetching = () => {
  const renderCard = () => {
    return (
      <SkeletonTheme>
        <div className={cn(styles.wrapper, styles.fetching)}>
          <Skeleton className={styles.banner} height={150} />
          <div className={styles.details}>
            <Skeleton className={styles.title} height={40} />
            <div className={styles.infos}>
              <ul>
                <li>
                  <CalendarIcon />
                  <Skeleton height={20} width={160} />
                </li>
                <li>
                  <Presential2Icon />
                  <Skeleton height={20} width={160} />
                </li>
              </ul>
            </div>
            <div className={styles.actions} />
          </div>
        </div>
      </SkeletonTheme>
    );
  };
  return renderCard();
};
