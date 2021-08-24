import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { SOCIAL_NETWORKS_HOSTS } from "../../config";
import Communities from "./Communities";
import Apps from "./Apps";
import Notifs from "./Notifs";
import MenuItem from "./MenuItem";
import { Avatar } from "../Avatar/Avatar";
import styles from "./Header.module.scss";

const I18N = {
  en: {
    signIn: "Login / Sign up",
    logout: "Logout",
    profile: "Profile",
  },
  fr: {
    signIn: "Connexion / Inscription",
    logout: "Se déconnecter",
    profile: "Profil",
  },
  nl: {
    signIn: "Aanmelden / Inschrijven",
    logout: "Uitloggen",
    profile: "Profiel",
  },
};

export class Header extends Component {
  state = {
    showSettings: false,
  };

  settingsRef = createRef();

  componentDidMount() {
    window.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = ({ target }) => {
    if (
      this.settingsRef &&
      this.settingsRef.current &&
      this.settingsRef.current.contains(target)
    ) {
      this.setState(({ showSettings }) => ({ showSettings: !showSettings }));
      return;
    }

    this.setState({ showSettings: false });
  };

  renderContactSocialNetworkBlock(contactSocialNetworks, socialNetworkName) {
    if (!contactSocialNetworks) {
      return null;
    }

    const socialNetwork = contactSocialNetworks[socialNetworkName];

    if (socialNetwork) {
      let accessValue =
        socialNetworkName === "twitter"
          ? socialNetwork.username
          : socialNetwork.id;
      let snUrl =
        socialNetworkName === "linkedin"
          ? socialNetwork.publicProfileUrl
            ? socialNetwork.publicProfileUrl
            : ""
          : `${
              SOCIAL_NETWORKS_HOSTS[socialNetworkName.toUpperCase()]
            }/${accessValue}`;

      return (
        <li className="social">
          <a href={`${snUrl}`} target="_blank">
            <i className={`icon icon-social-${socialNetworkName}`} />
          </a>
        </li>
      );
    }

    return null;
  }

  renderLoggedIn() {
    const {
      rightLinks,
      apps,
      onSearchClick,
      notifications,
      user,
      contactSocialNetworks,
      lng,
      onLanguageChange,
      onLogout,
    } = this.props;

    const { avatarUrl, firstName, lastName, mainEmail } = user;
    const languages = ["fr", "nl", "en"];

    const avatarDiv = avatarUrl ? (
      <Avatar
        avatarUrl={avatarUrl}
        firstName={firstName}
        lastName={lastName}
        showInfo={false}
      />
    ) : (
      <Avatar firstName={firstName} lastName={lastName} showInfo={false} />
    );

    return (
      <>
        <div className={styles.headerRight}>
          <ul className={`${styles.menu} ${styles.buttons}`}>
            {rightLinks.home.activated && (
              <MenuItem
                icon={rightLinks.home.icon}
                href={`${rightLinks.home.url}`}
              />
            )}
            {rightLinks.profile.activated && (
              <MenuItem
                icon={rightLinks.profile.icon}
                href={`${rightLinks.profile.url}`}
              />
            )}
            {rightLinks.ebox.activated && (
              <MenuItem
                icon={rightLinks.ebox.icon}
                className={styles.ebox}
                href={`${rightLinks.ebox.url}`}
                count={102}
              />
            )}
            <Notifs
              notifications={notifications}
              lng={lng}
              onClick={this.handleNotificationClick}
            />
            <Apps apps={apps} />
            {rightLinks.search.activated && (
              <MenuItem icon={rightLinks.search.icon} onClick={onSearchClick} />
            )}
          </ul>

          <ul className={styles.menu}>
            <li
              className={`${styles.expandable} ${styles.menuImg} ${styles.profile}`}
            >
              {avatarDiv}
              <ul className={`${styles.menuDropdown}`}>
                <li className={styles.profileContainer}>
                  <Avatar
                    avatarUrl={avatarUrl}
                    firstName={firstName}
                    lastName={lastName}
                    avatarSignature={mainEmail}
                  />
                </li>
                <li className={`${styles.menuProfile}`}>
                  <ul>
                    <li>
                      <a href={rightLinks.profile.url}>
                        {I18N[lng]["profile"]}
                      </a>
                    </li>
                  </ul>
                </li>
                <li className={styles.menuLanguage}>
                  <ul>
                    {languages.map((language) => (
                      <li
                        id={language}
                        key={language}
                        className={
                          lng === language ? styles.headerLanguageSelected : ""
                        }
                        onClick={() => onLanguageChange(language)}
                      >
                        {language.toUpperCase()}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className={styles.social}>
                  <ul>
                    {this.renderContactSocialNetworkBlock(
                      contactSocialNetworks,
                      "facebook"
                    )}
                    {this.renderContactSocialNetworkBlock(
                      contactSocialNetworks,
                      "twitter"
                    )}
                    {this.renderContactSocialNetworkBlock(
                      contactSocialNetworks,
                      "linkedin"
                    )}
                  </ul>
                </li>
                <li className={styles.logout} onClick={onLogout}>
                  <Link to="/" className="text-center">
                    {I18N[lng]["logout"]}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </>
    );
  }

  renderLoggedOut() {
    const { lng, onLanguageChange, onClickLogin } = this.props;
    const languages = ["fr", "nl", "en"];

    return (
      <div className={styles.headerRight}>
        <ul className={styles.headerLanguages}>
          {languages.map((language) => (
            <li
              key={language}
              className={lng === language ? styles.headerLanguageSelected : ""}
              onClick={() => onLanguageChange(language)}
            >
              {language.toUpperCase()}
            </li>
          ))}
        </ul>
        <a className={styles.signIn} onClick={onClickLogin} href="">
          {I18N[lng]["signIn"]}
        </a>
      </div>
    );
  }

  render() {
    const {
      loggedIn = false,
      loggedAs,
      appName,
      appLogoUrl,
      communities,
      currentCommunity,
      onCommunityChange,
      lng,
      avatarUrl,
      firstName,
      lastName,
      profileUrl,
      eboxUrl,
      onClickLogo,
      settings = [],
      onLanguageChange,
      ...otherProps
    } = this.props;

    // TODO sanitize otherprops

    return (
      <header className={styles.header} {...otherProps}>
        <div className={styles.headerLeft}>
          <span
            className={`${styles.menuLogo} ${
              this.state.showSettings ? styles.shadow : ""
            }`}
          >
            <div>
              <span
                ref={this.settingsRef}
                className={`icon-options-vertical ${styles.settingsIcon}`}
                style={settings.length === 0 ? { visibility: "hidden" } : {}}
              />
              <ul
                className={`${styles.menuDropdown} ${
                  this.state.showSettings ? styles.show : ""
                }`}
              >
                {settings.map(({ label, url }) => (
                  <li key={url}>
                    <Link to={url}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/" className={styles.appInfo}>
              <img className={styles.appLogo} src={appLogoUrl} alt="logo" />
              <span className={styles.appName}>{appName}</span>
            </Link>
          </span>
          {loggedIn && loggedAs !== "GUEST" && loggedAs !== "EMPTY" && (
            <nav className="top-bar-left">
              <ul className="menu">
                <Communities
                  communities={communities}
                  currentCommunity={currentCommunity}
                  onCommunityChange={onCommunityChange}
                  lng={lng}
                />
              </ul>
            </nav>
          )}
        </div>
        {loggedIn ? this.renderLoggedIn() : this.renderLoggedOut()}
      </header>
    );
  }
}

Header.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  loggedAs: PropTypes.string,
  appName: PropTypes.string,
  appLogoUrl: PropTypes.string,
  avatarUrl: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  profileUrl: PropTypes.string,
  eboxUrl: PropTypes.string,
  lng: PropTypes.oneOf(["fr", "nl", "en"]).isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};
