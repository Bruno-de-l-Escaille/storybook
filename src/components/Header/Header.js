import React, { Component } from "react";

import styles from "./Header.module.scss";
import MenuItem from "./MenuItem";
import MenuLink from "./MenuLink";
import Apps from "./Apps";
import MenuProfile from "./MenuProfile";
import Communities from "./Communities";
import Notifs from "./Notifs";

const I18N = {
  en: {
    signIn: "Login / Sign up",
  },
  fr: {
    signIn: "Connexion / Inscription",
  },
  nl: {
    signIn: "Aanmelden / Inschrijven",
  },
};

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
    };
  }

  _Search() {
    this.props.onSearchClick();
  }

  handleShowSettings = () => {
    const { showSettings } = this.state;
    this.setState({ showSettings: !showSettings });
  };

  renderLoggedIn() {
    const { rightIcons, auth, lng, notifications } = this.props;
    const { navCommunity, user } = auth;

    return (
      <>
        <div className={styles.headerRight}>
          <ul className={`${styles.menu} ${styles.buttons}`}>
            {rightIcons.backoffice?.activated && (
              <MenuLink
                icon={rightIcons.backoffice.icon}
                href={`${rightIcons.backoffice.url}`}
              >
                {rightIcons.backoffice.label}
              </MenuLink>
            )}
            {rightIcons.home.activated && (
              <MenuItem
                icon={rightIcons.home.icon}
                href={`${rightIcons.home.url}`}
              />
            )}
            {rightIcons.profile.activated && (
              <MenuItem
                icon={rightIcons.profile.icon}
                href={`${rightIcons.profile.url}`}
              />
            )}
            {rightIcons.ebox.activated && (
              <MenuItem
                icon={rightIcons.ebox.icon}
                href={`${rightIcons.ebox.url}`}
              />
            )}
            {rightIcons.notifs.activated && (
              <Notifs
                notifications={notifications}
                lng={lng}
                auth={auth}
                rightIcon={rightIcons.notifs}
                handleNotificationClick={(e) =>
                  this.props.handleNotificationClick(e)
                }
                handleEditClick={() => this.props.handleNotificationEditClick()}
              />
            )}
            {rightIcons.faq?.activated && (
              <div onClick={() => this.props.onFaqClick()}>
                <MenuItem icon={rightIcons.faq.icon} />
              </div>
            )}
            {rightIcons.apps?.activated && navCommunity && (
              <Apps apps={navCommunity.appsState} />
            )}

            {rightIcons.search.activated && (
              <div onClick={this._Search.bind(this)}>
                <MenuItem icon={rightIcons.search.icon} />
              </div>
            )}
          </ul>

          <MenuProfile
            user={user}
            lng={lng}
            rightIcons={rightIcons}
            onLogoutClick={(e) => this.props.onLogoutClick(e)}
            onLanguageChange={(language) =>
              this.props.onLanguageChange(language)
            }
          />
        </div>
      </>
    );
  }

  renderLoggedOut() {
    const { lng, app } = this.props;
    const { appUrl, homeUrl, isPrivateBlog } = app;
    const languages = ["fr", "nl", "en"];

    return (
      <div className={styles.headerRight}>
        <ul className={styles.headerLanguages}>
          {languages.map((language) => (
            <li
              key={language}
              className={lng === language ? styles.headerLanguageSelected : ""}
              onClick={() => this.props.onLanguageChange(language)}
            >
              {language.toUpperCase()}
            </li>
          ))}
        </ul>
        <a
          className={styles.signIn}
          href={
            isPrivateBlog
              ? `${homeUrl}/?gotoWithAuth=${appUrl}`
              : `${homeUrl}/?goto=${appUrl}`
          }
        >
          {I18N[lng]["signIn"]}
        </a>
      </div>
    );
  }

  renderLeftSide() {
    const {
      app,
      settings,
      lng,
      auth,
      Link,
      onSelectAllCommunities,
    } = this.props;
    const { appName, appLogoUrl, appUrl, isPrivateBlog } = app;
    return (
      <>
        <div className={styles.headerLeft}>
          <div
            className={`${styles.menuLogo} ${
              this.state.showSettings ? styles.shadow : ""
            }`}
          >
            {auth.navCommunity && auth.user && settings.length > 0 && (
              <div>
                <span
                  ref={this.settingsRef}
                  className={`icon-sb-more-vertical ${styles.settingsIcon}`}
                  style={settings.length === 0 ? { visibility: "hidden" } : {}}
                  onClick={this.handleShowSettings.bind(this)}
                />
                <ul
                  className={`${styles.menuDropdown} ${
                    this.state.showSettings ? styles.show : ""
                  }`}
                >
                  {settings.map(({ label, url }) => (
                    <li key={url}>
                      {Link ? (
                        <Link href={url}>
                          <a>{label}</a>
                        </Link>
                      ) : (
                        <a href={url}>{label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Link ? (
              <Link href={appUrl} className={styles.appInfo}>
                <a>
                  <img className={styles.appLogo} src={appLogoUrl} alt="logo" />
                  {!isPrivateBlog && (
                    <span className={styles.appName}>{appName}</span>
                  )}
                </a>
              </Link>
            ) : (
              <a href={appUrl} className={styles.appInfo}>
                <img className={styles.appLogo} src={appLogoUrl} alt="logo" />
                {!isPrivateBlog && (
                  <span className={styles.appName}>{appName}</span>
                )}
              </a>
            )}
          </div>

          {auth.user && auth.user.communities && !isPrivateBlog && (
            <Communities
              communities={auth.user.communities}
              currentCommunity={auth.navCommunity}
              lng={lng}
              app={app}
              Link={Link}
              onSelectAllCommunities={onSelectAllCommunities}
            />
          )}
        </div>
      </>
    );
  }

  render() {
    const { auth, lng, menu } = this.props;
    return (
      <>
        <header className={styles.header}>
          {this.renderLeftSide()}
          {!auth.user ? this.renderLoggedOut() : this.renderLoggedIn()}
        </header>
      </>
    );
  }
}
