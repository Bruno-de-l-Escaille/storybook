import React, { Component } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./AuthorCard.module.scss";

export const Fetching = () => {
  return (
    <div className={styles["author-card"]}>
      <div className={styles.avatar}>
        <Skeleton circle={true} height={191} width={191} />
      </div>
      <h3>
        <Skeleton width={120} />
      </h3>
      <p>
        <Skeleton width={200} />
        <br />
        <Skeleton width={80} />
      </p>

      <ul className={styles.social}>
        <li>
          <Skeleton circle={true} height={30} width={30} />
        </li>
        <li>
          <Skeleton circle={true} height={30} width={30} />
        </li>
        <li>
          <Skeleton circle={true} height={30} width={30} />
        </li>
      </ul>

      <div className={styles.footer}>
        <Skeleton height={30} width={100} />

        <Skeleton height={30} width={80} />
      </div>
    </div>
  );
};
