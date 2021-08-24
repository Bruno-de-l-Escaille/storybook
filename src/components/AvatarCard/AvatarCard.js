import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import * as icons from "../Icons";
import styles from "../UserCard/UserCard.module.scss";
import { TTP_API_URL } from "../../config";
import { addLandaSize, getUserNameForAvatar } from "../../utils";
import { Fetching } from "./Fetching";
import { I18N } from "../../i18n";

export class AvatarCard extends Component {
  constructor() {
    super();

    this.selectUser = this.selectUser.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
  }

  selectUser() {
    const { user } = this.props;
    this.props.toggleUser(user);
  }

  handleAvatarClick = (e) => {
    e.stopPropagation();
    this.props.onAvatarClick(this.props.user);
  };

  renderAvatar() {
    const { isSelected, showAvatarEdit, user } = this.props;
    const { avatar, avatarUrl, firstName, lastName, company } = user;

    const checkClasses = classnames(styles.check, isSelected && styles.active);
    const IconCheck = icons["Check"];
    const checkDiv = (
      <div className={checkClasses}>
        <IconCheck />
      </div>
    );

    if (avatarUrl || avatar) {
      const classes = classnames(
        styles.avatar,
        isSelected && styles.selected,
        showAvatarEdit && styles.editAvatar
      );
      return (
        <div
          className={classes}
          onClick={this.selectUser}
          style={{
            backgroundImage: `url(${
              avatarUrl
                ? addLandaSize(avatarUrl, 260)
                : TTP_API_URL + "/" + avatar
            })`,
          }}
        >
          {checkDiv}
          {showAvatarEdit && (
            <a className={styles.updateButton} onClick={this.handleAvatarClick}>
              <i className={` ${styles.icon} icon-note`}></i>
            </a>
          )}
        </div>
      );
    }

    const classes = classnames(
      styles.avatar,
      styles.emptyAvatar,
      isSelected && styles.selected,
      showAvatarEdit && styles.editAvatar
    );
    const avatarUserName =
      firstName || lastName
        ? getUserNameForAvatar(firstName, lastName)
        : getUserNameForAvatar(company, "");
    return (
      <div className={classes} onClick={this.selectUser}>
        <span>{avatarUserName}</span>
        {checkDiv}
        {showAvatarEdit && (
          <a className={styles.updateButton} onClick={this.handleAvatarClick}>
            <i className={` ${styles.icon} icon-note`}></i>
          </a>
        )}
      </div>
    );
  }

  renderHeadline() {
    const { headline } = this.props.user;
    if (headline) {
      return <h5>{headline}</h5>;
    } else {
      return <h5>&nbsp;</h5>;
    }
  }

  render() {
    const { theme, isFetching } = this.props;

    if (isFetching) {
      return <Fetching theme={theme} />;
    }

    const { firstName, lastName, company } = this.props.user;
    const avatarInfo =
      firstName || lastName ? firstName + " " + lastName : company;

    return (
      <div className={`${styles.userCard} ${styles[theme]}`}>
        {this.renderAvatar()}
        <div className={styles.header}>
          <h3>{avatarInfo}</h3>
          {this.renderHeadline()}
        </div>
      </div>
    );
  }
}
