import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

const I18N = {
  en: {
    communities: "Communities",
  },
  fr: {
    communities: "Communautés",
  },
  nl: {
    communities: "Gemeenschappen",
  },
};

export default class Communities extends Component {
  renderCommunities() {
    const { communities, onCommunityChange } = this.props;

    if (!communities || communities.length === 0) {
      return null;
    }

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
      clientsBlock.push(
        <li
          className={styles.menu__subChild}
          key={`client-${communities[i].id}`}
        >
          <NavLink
            to="/"
            activeClassName="active"
            onClick={() => onCommunityChange(communities[i].id)}
          >
            {logoBlock}
            {clientName}
          </NavLink>
        </li>
      );
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

    let navText = I18N[lng]["Communities"];

    if (currentCommunity) {
      navText =
        currentCommunity.abbreviation ||
        (currentCommunity.name.length <= 20
          ? currentCommunity.name
          : currentCommunity.name.substring(0, 20));
    }

    return (
      <li className={`${styles.menu__hasChild} ${styles.menu__community}`}>
        <span className={`${styles.menu__link}`} style={{ cursor: "pointer" }}>
          <span>{navText}</span>
          <i className="icon-sb-arrow-down" />
        </span>
        {this.renderCommunities()}
      </li>
    );
  }
}
