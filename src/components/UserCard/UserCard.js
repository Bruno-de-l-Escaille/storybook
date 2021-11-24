import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import * as icons from "../Icons";
import styles from "./UserCard.module.scss";
import { TTP_API_URL } from "../../config";
import { addLandaSize, getUserNameForAvatar } from "../../utils";
import { Fetching } from "./Fetching";

import { I18N } from "../../i18n";

export class UserCard extends Component {
  constructor() {
    super();

    this.selectUser = this.selectUser.bind(this);
    this.showUserFormModal = this.showUserFormModal.bind(this);
    this.handleAvatarClick = this.handleAvatarClick.bind(this);
  }
  selectUser() {
    const { id } = this.props.user;
    this.props.toggleUser(id);
  }
  handleAvatarClick = (e) => {
    e.stopPropagation();
    this.props.onAvatarClick(this.props.user);
  };
  getHeadlineValue(headlines) {
    if (headlines.fr) {
      return headlines.fr;
    } else if (headlines.en) {
      return headlines.en;
    } else if (headlines.nl) {
      return headlines.nl;
    }

    return null;
  }
  renderAvatar() {
    const { user, showAvatarEdit, isSelected } = this.props;
    const { avatar, avatarUrl, id, firstName, lastName } = user;

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
          {this.renderUserExtraButton()}
          {showAvatarEdit && (
            <a className={styles.updateButton} onClick={this.handleAvatarClick}>
              <i className={` ${styles.icon} icon-sb-edit`}></i>
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
    return (
      <div className={classes} onClick={this.selectUser}>
        <span>{getUserNameForAvatar(firstName, lastName)}</span>
        {checkDiv}
        {this.renderUserExtraButton()}
        {showAvatarEdit && (
          <a className={styles.updateButton} onClick={this.handleAvatarClick}>
            <i className={` ${styles.icon} icon-sb-edit`}></i>
          </a>
        )}
      </div>
    );
  }

  renderSignature() {
    const {
      firstName,
      lastName,
      role,
      blogRoleInOrganization,
      language,
      id,
    } = this.props.user;

    let headlines =
      !blogRoleInOrganization ||
      blogRoleInOrganization.length === 0 ||
      !blogRoleInOrganization[0].meta ||
      !blogRoleInOrganization[0].meta.headlines
        ? {}
        : blogRoleInOrganization[0].meta.headlines;
    let defaultSignatureDiv = [];
    defaultSignatureDiv.push(
      <h3 key={`h3-${id}`}>{firstName + " " + lastName}</h3>
    );

    if (headlines && headlines[language]) {
      defaultSignatureDiv.push(<h4 key={`h4-${id}`}>{headlines[language]}</h4>);
    } else if (headlines) {
      defaultSignatureDiv.push(
        <h4 key={`h4-${id}`}>{this.getHeadlineValue(headlines)}</h4>
      );
    }
    if (blogRoleInOrganization && blogRoleInOrganization.length > 0) {
      const role = blogRoleInOrganization[0].role;
      defaultSignatureDiv.push(
        <h5 key={`h5-${id}`}>
          <span>
            {I18N[language][role] + " "}
            {blogRoleInOrganization[0].role !== "CHIEF_EDITOR" && (
              <span className="mandated">
                (
                {blogRoleInOrganization[0].mandated === 0 ||
                blogRoleInOrganization[0].mandated === false
                  ? I18N[language]["Not_Mandated"]
                  : I18N[language]["Mandated"]}
                )
              </span>
            )}
          </span>
        </h5>
      );
    } else if (role && role.id !== undefined) {
      defaultSignatureDiv.push(
        <h5 key={`h5-${id}`}>{I18N[language][role.type]}</h5>
      );
    }
    return defaultSignatureDiv;
  }

  renderUserExtraButton() {
    const { metas } = this.props.user;
    let logoPath =
      metas && metas.organization && metas.organization.path
        ? metas.organization.path
        : null;
    return (
      <div className={styles.extraInfos} onClick={this.showUserFormModal}>
        {logoPath ? (
          <div
            src={logoPath}
            className={styles.extraInfos__logo}
            style={{ backgroundImage: `url(${logoPath})` }}
          ></div>
        ) : (
          <i className="icon-sb-briefcase"></i>
        )}
      </div>
    );
  }

  showUserFormModal() {
    const { metas, id } = this.props.user;
    let user = { metas, id };
    this.props.displayUserMetaFormModal(user);
  }

  render() {
    const { theme, isFetching } = this.props;
    if (isFetching) {
      return <Fetching theme={theme} />;
    }

    return (
      <div className={`${styles.userCard} ${styles[theme]}`}>
        {this.renderAvatar()}
        <div className={styles.header}>{this.renderSignature()}</div>
      </div>
    );
  }
}
