import React, { PureComponent } from "react";
import Switch from "../Switch/Switch/index";

import styles from "./CookieConsent.module.scss";

const I18N = {
  en: {
    functional_cookies: "Functional Cookies",
    optional_cookies: "Optional Cookies",
    title: "Cookies management",
    consent_text:
      "This site uses cookies to provide necessary website functionality, improve your experience and analyze our traffic. By using our website, you agree to our Privacy Policy and our cookies usage.",
    cookie_accept: "Accept",
    more_infos: "Find out more",
    back: "Back",
    details: "Details",
    amazon_text: "This cookie is managed by AWS for server load balancing",
    analytics_text:
      "Audience measurement and traffic analysis tool on our site",
    tamtam_text:
      "Used to save your language and personalization preferences to enhance your experience",
  },
  fr: {
    functional_cookies: "Cookies fonctionnel",
    optional_cookies: "Cookies optionnel",
    title: "Gestion des Cookies",
    consent_text:
      "Ce site utilise des cookies pour fournir les fonctionnalités nécessaires du site Web, améliorer votre expérience et analyser notre trafic. En utilisant notre site Web, vous acceptez notre politique de confidentialité et notre utilisation des cookies.",
    cookie_accept: "J'accepte",
    more_infos: "En savoir plus",
    back: "Retour",
    details: "Détails",
    amazon_text:
      "Ce cookie est géré par AWS pour l'équilibrage de charge serveur",
    analytics_text:
      "Outil de mesure d’audience et d'analyse du traffic sur notre site",
    tamtam_text:
      "Utilisé pour mémoriser vos préférences linguistiques et de personnalisation afin d'améliorer votre expérience",
  },
  nl: {
    functional_cookies: "Functionele Cookies",
    optionele_cookies: "Optionele cookies",
    title: "Beheer van cookies",
    consent_text:
      "Deze site maakt gebruik van cookies om de noodzakelijke websitefunctionaliteit te bieden, uw ervaring te verbeteren en ons verkeer te analyseren. Door onze website te gebruiken, gaat u akkoord met ons privacybeleid en ons gebruik van cookies.",
    cookie_accept: "Aanvaarden",
    more_infos: "Meer informaties",
    back: "Opbrengst",
    details: "Details",
    amazon_text: "Deze cookie wordt beheerd door AWS voor servertaakverdeling",
    analytics_text: "Doelgroepmeting en verkeersanalysetool op onze site",
    tamtam_text:
      "Wordt gebruikt om uw taal- en personalisatievoorkeuren te onthouden om uw ervaring te verbeteren",
  },
};

export class CookieConsent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      showInfo: false,
    };
    this.onAccept = this.onAccept.bind(this);
    this.onShowInfo = this.onShowInfo.bind(this);
  }

  componentDidMount() {
    if (this.getCookieValue() === null) {
      this.setState({ visible: true });
    }
  }

  getCookieValue() {
    const { cookieName } = this.props;
    var cookieValue = localStorage.getItem(cookieName);
    return cookieValue;
  }

  onAccept() {
    const { cookieName, onAcceptCookies } = this.props;
    if (onAcceptCookies) onAcceptCookies();
    localStorage.setItem(cookieName, true);
    this.setState({ visible: false });
  }

  onShowInfo() {
    const { showInfo } = this.state;

    this.setState({ showInfo: !showInfo });
  }

  render() {
    const { visible, showInfo } = this.state;
    let {
      lng,
      cookiesData,
      acceptCookies,
      onToggleSwitch,
      isSaving,
    } = this.props;
    if (!lng) {
      lng = "fr";
    }
    const functionalAttr = `functionalCookies${
      lng.charAt(0).toUpperCase() + lng.slice(1)
    }`;

    const optionalAttr = `optionalCookies${
      lng.charAt(0).toUpperCase() + lng.slice(1)
    }`;

    return !visible ? null : (
      <div
        className={`${styles.container} ${
          showInfo ? styles.container_active : ""
        }`}
      >
        <div className={styles.title}>{I18N[lng]["title"]}</div>
        <div className={styles.text}>{I18N[lng]["consent_text"]}</div>
        <div
          className={`${styles.info} ${showInfo ? styles.info_active : ""} `}
        >
          <div>{I18N[lng]["details"]}</div>
          <div className={styles.cookiesDetails}>
            <div className={styles.section}>
              <div className={styles.section_header}>
                <h2>{I18N[lng]["functional_cookies"]}</h2>
                <Switch isChecked={true} />
                <div className={styles.disable}></div>
              </div>
              <p
                className="sun-editor-editable"
                dangerouslySetInnerHTML={{
                  __html: cookiesData ? cookiesData[functionalAttr] : "",
                }}
              ></p>
            </div>
            <div className={styles.section}>
              <div className={styles.section_header}>
                <h2>{I18N[lng]["optional_cookies"]}</h2>
                <Switch
                  isChecked={acceptCookies}
                  onChange={() => onToggleSwitch()}
                />
                {isSaving && <div className={styles.disable}></div>}
              </div>
              <p
                className="sun-editor-editable"
                dangerouslySetInnerHTML={{
                  __html: cookiesData ? cookiesData[optionalAttr] : "",
                }}
              ></p>
            </div>
          </div>
        </div>

        <button className={styles.buttonInfo} onClick={this.onShowInfo}>
          {showInfo ? I18N[lng]["back"] : I18N[lng]["more_infos"]}
        </button>
        <button className={styles.button} onClick={this.onAccept}>
          {I18N[lng]["cookie_accept"]}
        </button>
      </div>
    );
  }
}
