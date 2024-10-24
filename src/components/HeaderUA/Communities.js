import React, { Component } from "react";
import styles from "./Header.module.scss";
import classnames from "classnames";

const I18N = {
  en: {
    viewAll: "View all",
  },
  fr: {
    viewAll: "Voir tout",
  },
  nl: {
    viewAll: "Bekijk alles",
  },
};

export default class Communities extends Component {
  renderCommunities() {
    const { communities, app, onSelectCommunity } = this.props;
    const { appUrl } = app;

    if (!communities || communities.length === 0) {
      return null;
    }

    let clientsBlock = [];

    for (let i = 0; i < communities.length; i++) {
      let logo = communities[i].organization.avatarUrl
        ? `${communities[i].organization.avatarUrl}`
        : "img/default-logo.png";
      let logoBlock = (
        <span
          className={styles.boxes__box__logo}
          style={{ backgroundImage: `url(${logo})` }}
        ></span>
      );
      let clientName = communities[i].organization.name;
      if (communities[i].organization.abbreviation) {
        clientName = communities[i].organization.abbreviation;
      } else if (clientName.length > 30) {
        clientName = clientName.substr(0, 30) + "...";
      }

      if (onSelectCommunity) {
        clientsBlock.push(
          <li
            className={styles.menu__subChild}
            key={`client-${communities[i].organization.id}`}
            onClick={() => onSelectCommunity(communities[i])}
          >
            <a href="javascript:void(0);">
              {logoBlock}
              {clientName}
            </a>
          </li>
        );
      }
    }

    return (
      <div className={styles.menu__dropdown}>
        <ul>{clientsBlock}</ul>
      </div>
    );
  }

  render() {
    const { currentCommunity, communities } = this.props;

    if (!communities || communities.length === 0) {
      return null;
    }

    let navText = "Communities";

    if (currentCommunity) {
      navText =
        currentCommunity.abbreviation ||
        (currentCommunity.name.length <= 20
          ? currentCommunity.name
          : currentCommunity.name.substring(0, 20));
    }

    return (
      <div
        className={classnames(styles.menu__hasChild, styles.menu__community)}
      >
        <div className={`${styles.menu__link}`} style={{ cursor: "pointer" }}>
          <span>{navText}</span>
          <i className="icon-sb-arrow-down"></i>
        </div>
        {this.renderCommunities()}
      </div>
    );
  }
}
