import React, { Component } from "react";
import styles from "./Header.module.scss";
import { Avatar } from "../Avatar/Avatar";
import { SOCIAL_NETWORKS_HOSTS } from "../../config";

const I18N = {
  en: {
    logout: "Logout",
    profile: "Profile",
  },
  fr: {
    logout: "Se déconnecter",
    profile: "Profil",
  },
  nl: {
    logout: "Uitloggen",
    profile: "Profiel",
  },
};

class MenuProfile extends Component {
  _Logout(e) {
    console.log("mmm");
    this.props.onLogoutClick(e);
  }

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
            <i className={`icon-sb-${socialNetworkName}`} />
          </a>
        </li>
      );
    }

    return null;
  }

  render() {
    const {
      user,
      lng,
      rightIcons,
      firstList,
      secondList,
      thirdList,
      navigateTo,
    } = this.props;
    const {
      avatarUrl,
      firstName,
      lastName,
      mainEmail,
      contactSocialNetworks,
    } = user;
    const languages = ["fr", "nl", "en"];

    const avatarDiv = avatarUrl ? (
      <Avatar
        avatarUrl={avatarUrl}
        firstName={firstName}
        lastName={lastName}
        showInfo={false}
        noMargin={true}
      />
    ) : (
      <Avatar firstName={firstName} lastName={lastName} showInfo={false} />
    );

    return (
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
              <a href={rightIcons.profile.url}>{I18N[lng]["profile"]}</a>
            </li>
            <li className={styles.menuLanguage}>
              <ul>
                {languages.map((language) => (
                  <li
                    id={language}
                    key={language}
                    className={lng === language ? styles.selected : ""}
                    onClick={() => this.props.onLanguageChange(language)}
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
            {(firstList || secondList || thirdList) && (
              <li className={styles.footerItems}>
                <ul>
                  {firstList && (
                    <li className={styles.section}>
                      <ul>
                        {firstList.map((el) => (
                          <li onClick={() => navigateTo(el.url)}>
                            <div className={styles.block}></div>
                            <span>{el.label}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                  {secondList && (
                    <li className={styles.section}>
                      <ul>
                        {secondList.map((el) => (
                          <li onClick={() => navigateTo(el.url)}>
                            <div className={styles.block}></div>
                            <span>{el.label}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                  {thirdList && (
                    <li className={styles.section}>
                      <ul>
                        {thirdList.map((el) => (
                          <li onClick={() => navigateTo(el.url)}>
                            <div className={styles.block}></div>
                            <span>{el.label}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
              </li>
            )}
            <li
              className={styles.logout}
              onClick={(e) => this.props.onLogoutClick(e)}
            >
              {I18N[lng]["logout"]}
            </li>
          </ul>
        </li>
      </ul>
    );
  }
}

export default MenuProfile;
