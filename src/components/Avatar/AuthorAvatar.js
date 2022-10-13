import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./Avatar.module.scss";

export const AuthorAvatar = ({ author, white, Link }) => {
  const { name, headline, avatarUrl, url } = author;

  const renderContent = () => {
    return (
      <>
        {avatarUrl ? (
          <div
            className={styles.avatar}
            style={{ backgroundImage: `url(${avatarUrl})` }}
          ></div>
        ) : (
          <div className={`${styles.avatar} ${styles.emptyAvatar}`}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.avatarInfo}>
          <div
            className={styles.avatarName}
            style={{ color: white ? "#fff" : "#3c4e64" }}
          >
            {name}
          </div>
          {headline && (
            <div
              className={styles.avatarSignature}
              style={{ color: white ? "#fff" : "#6d7f92" }}
            >
              {headline}
            </div>
          )}
        </div>
      </>
    );
  };

  if (url) {
    if (Link) {
      return (
        <Link href={url}>
          <a className={styles.avatarContainer}>{renderContent()}</a>
        </Link>
      );
    } else {
      return (
        <a className={styles.avatarContainer} href={url}>
          {renderContent()}
        </a>
      );
    }
  } else {
    return <div className={styles.avatarContainer}>{renderContent()}</div>;
  }
};
