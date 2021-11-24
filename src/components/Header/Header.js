import React, { Component } from "react";
import AppendHead from "react-append-head";

import styles from "./Header.module.scss";
import MenuItem from "./MenuItem";
import MenuLink from "./MenuLink";
import Apps from "./Apps";
import MenuProfile from "./MenuProfile";
import Communities from "./Communities";
import Notifs from "./Notifs";
import TTPFaqWidget from "../TTPFaqWidget";
import * as icons from "../Icons";

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
      isFaqWidgetLoaded: false,
    };
  }

  componentDidMount() {
    // if (process.browser) {
    if (window.TTPFAQWidget !== undefined) {
      this.setState({ isFaqWidgetLoaded: true });
    }
    // }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (window.TTPFAQWidget !== undefined) {
        this.setState({ isFaqWidgetLoaded: true });
      }
    }
  }

  _Search() {
    this.props.onSearchClick();
  }

  handleShowSettings = () => {
    const { showSettings } = this.state;
    this.setState({ showSettings: !showSettings });
  };

  handleShowFaqWidget = () => {
    setTimeout(() => this.setState({ isFaqWidgetLoaded: true }), 1200);
  };

  handleFaqClick = () => {
    const { app } = this.props;
    if (window.showFAQ) {
      console.log("====", app.currentEvent ? true : false);
      app.currentEvent
        ? window.showFAQ(app.appName.toUpperCase(), app.currentEvent)
        : window.showFAQ(app.appName.toUpperCase());
    }
  };

  renderLoggedIn() {
    const {
      rightIcons,
      auth,
      lng,
      env,
      notifications,
      app,
      switchSpace,
    } = this.props;
    const { navCommunity, user } = auth;

    const Icon = icons["Portal"];

    return (
      <div className={styles.headerRight}>
        {switchSpace && (
          <div className={styles.switchSpace}>
            <span
              className={`${styles.switchSpace_left} ${
                switchSpace.current === switchSpace.items[0].key &&
                styles.switchSpace_active
              }`}
              onClick={() => switchSpace.onChange(switchSpace.items[0].key)}
            >
              {switchSpace.items[0].label}
            </span>
            <Icon />
            <span
              className={`${styles.switchSpace_right} ${
                switchSpace.current === switchSpace.items[1].key &&
                styles.switchSpace_active
              }`}
              onClick={() => switchSpace.onChange(switchSpace.items[1].key)}
            >
              {switchSpace.items[1].label}
            </span>
          </div>
        )}
        <ul className={`${styles.menu} ${styles.buttons}`}>
          {rightIcons.backoffice?.activated && (
            <MenuLink icon="Settings" href={`${rightIcons.backoffice.url}`}>
              {rightIcons.backoffice.label}
            </MenuLink>
          )}
          {rightIcons.home.activated && (
            <MenuItem icon="Portal" href={`${rightIcons.home.url}`} />
          )}
          {rightIcons.profile.activated && (
            <MenuItem icon="Profile" href={`${rightIcons.profile.url}`} />
          )}
          {rightIcons.ebox.activated && (
            <MenuItem icon="Ebox" href={`${rightIcons.ebox.url}`} />
          )}
          {rightIcons.notifs.activated && (
            <Notifs
              notifications={notifications}
              lng={lng}
              env={env}
              auth={auth}
              navCommunity={navCommunity}
              appName={app.appName}
            />
          )}
          {rightIcons.faq?.activated && (
            <div onClick={this.handleFaqClick.bind(this)}>
              <MenuItem icon="Help" />
            </div>
          )}
          {rightIcons.apps?.activated && navCommunity && (
            <Apps apps={navCommunity.appsState} />
          )}

          {rightIcons.search.activated && (
            <div onClick={this._Search.bind(this)}>
              <MenuItem icon="Search" />
            </div>
          )}
        </ul>

        <MenuProfile
          user={user}
          lng={lng}
          rightIcons={rightIcons}
          onLogoutClick={(e) => this.props.onLogoutClick(e)}
          onLanguageChange={(language) => this.props.onLanguageChange(language)}
        />
      </div>
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
      allCommunitiesUrl,
      onSelectAllCommunities,
      onSelectCommunity,
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
              <Link href={appUrl}>
                <a className={styles.appInfo}>
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
              allCommunitiesUrl={allCommunitiesUrl}
              onSelectAllCommunities={onSelectAllCommunities}
              onSelectCommunity={onSelectCommunity}
            />
          )}
        </div>
      </>
    );
  }

  render() {
    const { auth, app, env, lng, rightIcons } = this.props;
    const { isFaqWidgetLoaded } = this.state;

    const loadNotifWidget =
      app.appName.toUpperCase() === "EVENT" ||
      (rightIcons &&
        (rightIcons.notifs?.activated || rightIcons.faq?.activated));

    return (
      <>
        {loadNotifWidget && (
          <AppendHead onLoad={this.handleShowFaqWidget.bind(this)}>
            <link
              name="faq-widget"
              rel="stylesheet"
              href={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/faq/${env}/static/css/widget.css`}
            ></link>
            <script
              name="faq-widget-script"
              src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/faq/${env}/static/js/widget.js`}
            />
          </AppendHead>
        )}
        <header className={styles.header}>
          {this.renderLeftSide()}
          {!auth.user ? this.renderLoggedOut() : this.renderLoggedIn()}
        </header>
        {loadNotifWidget && isFaqWidgetLoaded && (
          <TTPFaqWidget language={lng} auth={auth} faq />
        )}
      </>
    );
  }
}
