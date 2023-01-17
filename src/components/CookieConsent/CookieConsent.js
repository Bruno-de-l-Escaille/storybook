import React, { PureComponent } from "react";

import { getCookie, setCookie } from "../../utils";

import Switch from "../Switch/Switch/index";
import styles from "./CookieConsent.module.scss";

const I18N = {
  en: {
    functional_cookies: "Functional Cookies",
    optional_cookies: "Optional Cookies",
    title: "Cookies management",
    consent_text:
      "<p>Your privacy is our priority</p><br><p>This website uses cookies. Some cookies are strictly necessary for the proper functioning of the site: you cannot refuse them. In order to optimize your experience, optional cookies are also used, for which your prior consent is required for their placement! In particular, they make it possible to analyze traffic and offer you possibilities related to social networks.</p><br><p>You can change your preferences at any time via your browser settings or by using our privacy center, which can be activated via the “Manage my cookies” tab (make the link).To find out more about cookies, the data we use and the processing we carry out, you can consult our “cookie policy” and our privacy statement.</p>",
    cookie_accept: "Accept and close",
    more_infos: "Manage my cookies",
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
      "<p>Le respect de votre vie privée est notre priorité</p><br><p>Ce site web utilise  des cookies. Certains cookies sont strictement nécessaires au bon fonctionnement du site : vous ne pouvez pas les refuser. Afin d’optimiser votre expérience, des cookies optionnels sont également utilisés, pour lesquels votre consentement préalable est requis à leur placement ! Ils permettent notamment d’analyser le trafic et vous offrir des possibilités liées  aux réseaux sociaux.</p><br><p>Vous pouvez modifier vos préférences à tout moment via les paramètres de votre navigateur ou en utilisant notre centre de confidentialité, activable via l’onglet « Gérer mes cookies » (faire le link).Pour en savoir plus sur les cookies, les données que nous utilisons et les traitements que nous réalisons, vous pouvez consulter notre « cookie policy »  et notre déclaration de confidentialité.</p>",
    cookie_accept: "Accepter et fermer",
    more_infos: "Gérer mes cookies",
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
      "<p>Uw privacy is ons beleid</p><br><p>Deze website maakte gebruik van cookies. Sommige cookies zijn strikt noodzakelijk voor een goede werking van de website: u kan deze niet weigeren. Om uw gebruikservaring te verbeteren, worden ook optionele cookies gebruikt. Hiervoor vragen wij voorafgaand uw toestemming. Dankzij deze cookies kunnen wij het website-bezoek analyseren en mogelijkheden aanbieden via sociale media.</p><br><p>U kan uw voorkeuren wijzigen wanneer u dat wenst, via de instellingen van uw browser, of door uw instellingen op onze website te beheren. Dit kan door te klikken op het tabblad ‘Mijn cookies beheren’.</p><br><p>Wil u meer weten over cookies, de gegevens waar wij gebruik van maken en de verwerking ervan?</p><br><p>Lees dan zeker onze cookies policy en onze privacyverklaring.</p>",
    cookie_accept: "Aanvaarden en sluiten",
    more_infos: "My cookies beheerden",
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
    // var cookieValue = localStorage.getItem(cookieName);
    var cookieValue = getCookie(cookieName);
    return cookieValue ? cookieValue : null;
  }

  onAccept() {
    const { cookieName, cookieDomain, onAcceptCookies } = this.props;
    if (onAcceptCookies) {
      onAcceptCookies();
    }
    let dtExpire = new Date();
    dtExpire.setTime(dtExpire.getTime() + 9900000 * 1000);
    setCookie(cookieName, true, dtExpire, "/", cookieDomain);

    // localStorage.setItem(cookieName, true);
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
        {!showInfo && (
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{
              __html: I18N[lng]["consent_text"],
            }}
          ></div>
        )}
        <div
          className={`${styles.info} ${showInfo ? styles.info_active : ""} `}
        >
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
