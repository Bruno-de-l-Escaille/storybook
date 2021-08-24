import React, { Component } from "react";
import Skeleton from "react-loading-skeleton";
import PropTypes from "prop-types";
import classnames from "classnames";

import styles from "./AuthorCard.module.scss";

export const Fetching = () => {
  return (
    <div className={styles["author-card"]}>
      <div className={styles.avatar}>
        <Skeleton circle={true} height={191} width={191} />
      </div>
      <h3>
        <Skeleton circle={true} width={120} />
      </h3>
      <p>
        <Skeleton circle={true} width={200} />
        <br />
        <Skeleton circle={true} width={80} />
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
