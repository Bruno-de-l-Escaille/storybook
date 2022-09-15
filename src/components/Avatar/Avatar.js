import React, { Component } from "react";
import PropTypes from "prop-types";

import styles from "./Avatar.module.scss";
import { getUserNameForAvatar } from "../../utils";

export class Avatar extends Component {
  render() {
    const {
      avatarUrl,
      showInfo,
      firstName,
      lastName,
      avatarSignature,
      noMargin,
      isLarge,
    } = this.props;

    let avatarName = "";
    if (firstName) {
      avatarName += firstName;
    }
    if (lastName) {
      avatarName += " " + lastName;
    }
    return (
      <div className={styles.avatarContainer}>
        {avatarUrl ? (
          <div
            className={`${styles.avatar} ${
              noMargin ? styles.avatar_nomargin : ""
            } ${isLarge ? styles.avatar_large : ""}`}
            style={{ backgroundImage: `url(${avatarUrl})` }}
          ></div>
        ) : (
          <div
            className={`${styles.avatar} ${styles.emptyAvatar} ${
              noMargin ? styles.avatar_nomargin : ""
            }`}
          >
            {getUserNameForAvatar(firstName, lastName)}
          </div>
        )}
        {showInfo && (
          <div className={styles.avatarInfo}>
            <div className={styles.avatarName}>{avatarName}</div>
            {avatarSignature && (
              <div className={styles.avatarSignature}>{avatarSignature}</div>
            )}
          </div>
        )}
      </div>
    );
  }
}

Avatar.propTypes = {
  avatarUrl: PropTypes.string,
  showInfo: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  avatarSignature: PropTypes.string,
};
Avatar.defaultProps = {
  avatarUrl: null,
  showInfo: true,
};
