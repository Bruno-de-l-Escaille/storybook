import React, { Component } from "react";

import styles from "./Header.module.scss";
import MenuProfile from "./MenuProfile";
import AuthModal from "./AuthModal";

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

export class AuthLink extends Component {
  renderLoggedIn() {
    const {
      rightIcons,
      auth,
      lng,
      env,
      firstList,
      secondList,
      thirdList,
      navigateTo,
      showPersonalData,
      personalData,
      onAfterSavePersonal,
    } = this.props;
    const { navCommunity, user } = auth;

    return (
      <MenuProfile
        env={env}
        user={user}
        auth={auth}
        lng={lng}
        rightIcons={rightIcons}
        onLogoutClick={(e) => this.props.onLogoutClick(e)}
        onLanguageChange={(language) => this.props.onLanguageChange(language)}
        firstList={firstList}
        secondList={secondList}
        thirdList={thirdList}
        navigateTo={navigateTo}
        showPersonalData={showPersonalData}
        personalData={personalData}
        onAfterSavePersonal={onAfterSavePersonal}
      />
    );
  }

  renderLoggedOut() {
    const { lng, app, env } = this.props;

    return <AuthModal I18N={I18N} lng={lng} app={app} env={env} />;
  }

  render() {
    const { auth } = this.props;

    return <>{!auth.user ? this.renderLoggedOut() : this.renderLoggedIn()}</>;
  }
}
