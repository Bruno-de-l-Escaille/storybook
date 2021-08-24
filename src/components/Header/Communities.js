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
    const { communities, app, lng, Link, onSelectAllCommunities } = this.props;
    const { appUrl } = app;

    if (!communities || communities.length === 0) {
      return null;
    }

    const handleViewAll = () => {
      if (onSelectAllCommunities) {
        onSelectAllCommunities();
      }
    };

    let clientsBlock = [];

    for (let i = 0; i < communities.length; i++) {
      let logo = communities[i].avatarUrl
        ? `${communities[i].avatarUrl}`
        : "img/default-logo.png";
      let logoBlock = (
        <span
          className={styles.boxes__box__logo}
          style={{ backgroundImage: `url(${logo})` }}
        ></span>
      );
      let clientName = communities[i].name;
      if (communities[i].abbreviation) {
        clientName = communities[i].abbreviation;
      } else if (clientName.length > 30) {
        clientName = clientName.substr(0, 30) + "...";
      }

      if (Link) {
        clientsBlock.push(
          <li
            className={styles.menu__subChild}
            key={`client-${communities[i].id}`}
          >
            <Link
              href={`/${lng}/community/${communities[i].url}/${communities[i].id}`}
            >
              <a>
                {logoBlock}
                {clientName}
              </a>
            </Link>
          </li>
        );
      } else {
        clientsBlock.push(
          <li
            className={styles.menu__subChild}
            key={`client-${communities[i].id}`}
          >
            <a
              href={`${appUrl}/community/${communities[i].url}/${communities[i].id}`}
            >
              {logoBlock}
              {clientName}
            </a>
          </li>
        );
      }
    }
    if (clientsBlock.length > 1) {
      if (Link) {
        clientsBlock.push(
          <li
            className={styles.menu__seeAll}
            key={`c-all`}
            onClick={handleViewAll}
          >
            <Link href={`/${lng}/communities`}>
              <a>{I18N[lng]["viewAll"]}</a>
            </Link>
          </li>
        );
      } else {
        clientsBlock.push(
          <li
            className={styles.menu__seeAll}
            key={`c-all`}
            onClick={handleViewAll}
          >
            <a href={`${appUrl}/communities`}>{I18N[lng]["viewAll"]}</a>
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
    const { currentCommunity, lng, communities } = this.props;

    if (!communities || communities.length === 0) {
      return;
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
