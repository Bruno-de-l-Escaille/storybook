import React, { Component } from "react";
import AppendHead from "react-append-head";

import styles from "./Header.module.scss";
import MenuItem from "./MenuItem";
import MenuProfile from "./MenuProfile";
import Notifs from "./Notifs";
import Communities from "./Communities";

import TTPFaqWidget from "../TTPFaqWidget";
import * as icons from "../Icons";

const I18N = {
  en: {
    signIn: "Login",
    signUp: "Register",
    complete_account: "Complete your UA account",
  },
  fr: {
    signIn: "S'identifier",
    signUp: "S'inscrire",
    complete_account: "Completez votre compte UA",
  },
  nl: {
    signIn: "Herkennen",
    signUp: "Register",
    complete_account: "Voltooi uw UA -account",
  },
};

export class HeaderUA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      isFaqWidgetLoaded: false,
      portalSwitchCurrent: null,
    };
  }

  componentDidMount() {
    // if (process.browser) {
    if (window.TTPFAQWidget !== undefined) {
      this.setState({ isFaqWidgetLoaded: true });
    }
    // }
    if (this.props.portalSwitch && this.props.currentPortal) {
      this.setState({
        portalSwitchCurrent: this.props.portalSwitch.items.filter(
          (item) => item.key === this.props.currentPortal
        )[0],
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (window.TTPFAQWidget !== undefined) {
        this.setState({ isFaqWidgetLoaded: true });
      }

      if (this.props.portalSwitch && this.props.currentPortal) {
        this.setState({
          portalSwitchCurrent: this.props.portalSwitch.items.filter(
            (item) => item.key === this.props.currentPortal
          )[0],
        });
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
    setTimeout(() => this.setState({ isFaqWidgetLoaded: true }), 4000);
  };

  handleOnLoadFAQ = () => {
    if (this.props.onFAQLoad) {
      this.props.onFAQLoad();
    }
  };

  handleFaqClick = () => {
    const { app } = this.props;
    if (window.showFAQ) {
      window.showFAQ(app.appName.toUpperCase());
    }
  };

  renderLoggedIn() {
    const {
      rightIcons,
      auth,
      lng,
      languages,
      env,
      notifications,
      app,
      switchSpace,
      portalSwitch,
      currentPortal,
      RouterLink,
      firstList,
      secondList,
      thirdList,
      navigateTo,
      showOnBoardProgress,
      onBoardProgress,
      showPersonalData,
      personalData,
      onAfterSavePersonal,
      showProfileLink,
      disableLanguageChange = false,
    } = this.props;
    const { portalSwitchCurrent, isFaqWidgetLoaded } = this.state;
    const { user, navCommunity } = auth;

    const Icon = icons["Portal"];
    const IconSetting = icons["IconSetting"];

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
        {portalSwitchCurrent && (
          <div
            className={styles.portalSwitch}
            onClick={() => portalSwitch.onChange(portalSwitchCurrent)}
          >
            <div>
              <span className={styles.portalSwitch_iconPortal}>
                {portalSwitchCurrent.key === "SETTINGS" ? (
                  <IconSetting />
                ) : (
                  <Icon />
                )}
              </span>
              <span>{portalSwitchCurrent.label}</span>
              {portalSwitch.items.length > 1 && (
                <span className={styles.portalSwitch_iconArrow}>
                  <i className="icon-sb-arrow-down"></i>
                </span>
              )}
            </div>
            {portalSwitch.items.length > 1 && (
              <div className={styles.portalSwitch_dropdown}>
                <ul>
                  {portalSwitch.items.map((item, index) => {
                    if (item.key === currentPortal) {
                      return null;
                    }
                    return (
                      <li
                        key={index}
                        className={`${styles.portalSwitch_item} `}
                        onClick={(e) => {
                          e.stopPropagation();
                          portalSwitch.onChange(item);
                        }}
                      >
                        {item.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
        {showOnBoardProgress && (
          <div className={styles.progress}>
            <div>
              <div className={styles.progress_top}>
                <span>{I18N[lng]["complete_account"]}</span>
                <span className={styles.progress_top_value}>
                  {" "}
                  {onBoardProgress}%
                </span>
              </div>
              <div className={styles.progress_bar}>
                {onBoardProgress > 0 && (
                  <span
                    className={styles.progress_value}
                    style={{ width: onBoardProgress + "%" }}
                  ></span>
                )}
              </div>
            </div>
          </div>
        )}
        <ul className={`${styles.menu} ${styles.buttons}`}>
          {rightIcons.profile.activated && (
            <MenuItem icon="Profile" href={`${rightIcons.profile.url}`} />
          )}
          {rightIcons.notifs.activated && (
            <Notifs
              notifications={notifications}
              lng={lng}
              env={env}
              auth={auth}
              navCommunity={navCommunity}
              appName={app.appName}
              isFaqWidgetLoaded={isFaqWidgetLoaded}
            />
          )}
          {rightIcons.faq?.activated && (
            <div
              onClick={this.handleFaqClick.bind(this)}
              className={!isFaqWidgetLoaded && styles.iconLoading}
            >
              <MenuItem icon="Help" />
            </div>
          )}
        </ul>

        <MenuProfile
          env={env}
          user={user}
          auth={auth}
          lng={lng}
          languages={languages}
          rightIcons={rightIcons}
          RouterLink={RouterLink}
          onLogoutClick={(e) => this.props.onLogoutClick(e)}
          onLanguageChange={(language) => this.props.onLanguageChange(language)}
          firstList={firstList}
          secondList={secondList}
          thirdList={thirdList}
          navigateTo={navigateTo}
          showPersonalData={showPersonalData}
          personalData={personalData}
          onAfterSavePersonal={onAfterSavePersonal}
          showProfileLink={showProfileLink}
          disableLanguageChange={disableLanguageChange}
        />
      </div>
    );
  }

  renderLoggedOut() {
    const {
      lng,
      signInUrl,
      signUpUrl,
      RouterLink,
      languages,
      disableLanguageChange,
    } = this.props;

    return (
      <div className={styles.headerRight}>
        {!disableLanguageChange && (
          <ul className={styles.headerLanguages}>
            {languages.map((language) => (
              <li
                key={language}
                className={
                  lng === language ? styles.headerLanguageSelected : ""
                }
                onClick={() => this.props.onLanguageChange(language)}
              >
                {language.toUpperCase()}
              </li>
            ))}
          </ul>
        )}
        {RouterLink ? (
          <ul className={styles.headerLinks}>
            <li>
              <RouterLink to={signInUrl}>{I18N[lng]["signIn"]}</RouterLink>
            </li>
            <li>
              <RouterLink to={signUpUrl}>{I18N[lng]["signUp"]}</RouterLink>
            </li>
          </ul>
        ) : (
          <ul className={styles.headerLinks}>
            <li>
              <a href={signInUrl}>{I18N[lng]["signIn"]}</a>
            </li>
            <li className={styles.register}>
              <a href={signUpUrl}>{I18N[lng]["signUp"]}</a>
            </li>
          </ul>
        )}
      </div>
    );
  }

  renderLeftSide() {
    const { app, auth, settings, RouterLink, onSelectCommunity } = this.props;
    const { appLogoUrl, appUrl } = app;

    let uaFolderName = "";
    if (auth.navCommunity) {
      uaFolderName = auth.navCommunity.name;
      if (auth.navCommunity.abbreviation) {
        uaFolderName = auth.navCommunity.abbreviation;
      } else if (uaFolderName.length > 30) {
        uaFolderName = uaFolderName.substr(0, 30) + "...";
      }
    }
    return (
      <>
        <div className={styles.headerLeft}>
          <div
            className={`${styles.menuLogo} ${
              this.state.showSettings ? styles.shadow : ""
            }`}
          >
            {auth.user && settings.length > 0 && (
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
                      {RouterLink ? (
                        <RouterLink to={url}>{label}</RouterLink>
                      ) : (
                        <a href={url}>{label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {RouterLink ? (
              <RouterLink to={appUrl} className={styles.appInfo}>
                <img className={styles.appLogo} src={appLogoUrl} alt="logo" />
              </RouterLink>
            ) : (
              <a href={appUrl} className={styles.appInfo}>
                <img className={styles.appLogo} src={appLogoUrl} alt="logo" />
              </a>
            )}
          </div>

          {auth.user && auth.user.uaRoles && auth.user.uaRoles.length > 1 ? (
            <Communities
              communities={auth.user.uaRoles}
              currentCommunity={auth.navCommunity}
              app={app}
              onSelectCommunity={onSelectCommunity}
            />
          ) : (
            uaFolderName && (
              <div className={styles.menu__ua_folder}>
                {auth.navCommunity.avatarUrl ? (
                  <img src={auth.navCommunity.avatarUrl} alt={uaFolderName} />
                ) : (
                  <span>{uaFolderName}</span>
                )}
              </div>
            )
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
          <TTPFaqWidget
            language={lng}
            auth={auth}
            faq
            onLoadFAQ={this.handleOnLoadFAQ.bind(this)}
            isUA={true}
          />
        )}
      </>
    );
  }
}
