import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./Avatar.module.scss";

export class AuthorAvatar extends Component {
  render() {
    const { name, headline, avatarUrl, url, white } = this.props.author;

    if (url)
      return (
        <a className={styles.avatarContainer} href={url}>
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
              style={{ color: this.props.white ? "#fff" : "#3c4e64" }}
            >
              {name}
            </div>
            {headline && (
              <div
                className={styles.avatarSignature}
                style={{ color: this.props.white ? "#fff" : "#6d7f92" }}
              >
                {headline}
              </div>
            )}
          </div>
        </a>
      );
    else
      return (
        <div className={styles.avatarContainer}>
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
              style={{ color: this.props.white ? "#fff" : "#3c4e64" }}
            >
              {name}
            </div>
            {headline && (
              <div
                className={styles.avatarSignature}
                style={{ color: this.props.white ? "#F1F2F4" : "#6d7f92" }}
              >
                {headline}
              </div>
            )}
          </div>
        </div>
      );
  }
}

// Avatar.propTypes = {
//   avatarUrl: PropTypes.string,
//   showInfo: PropTypes.bool,
//   firstName: PropTypes.string,
//   lastName: PropTypes.string,
//   avatarSignature: PropTypes.string,
// };
// Avatar.defaultProps = {
//   avatarUrl: null,
//   showInfo: true,
// };
