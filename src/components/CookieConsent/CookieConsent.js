import React, { PureComponent } from "react";

import styles from "./CookieConsent.module.scss";

const I18N = {
  en: {
    cookie_consent:
      "This site uses cookies to provide necessary website functionality, improve your experience and analyze our traffic. By using our website, you agree to our Privacy Policy and our cookies usage.",
    cookie_accept: "Accept",
  },
  fr: {
    cookie_consent:
      "Ce site utilise des cookies pour fournir les fonctionnalités nécessaires du site Web, améliorer votre expérience et analyser notre trafic. En utilisant notre site Web, vous acceptez notre politique de confidentialité et notre utilisation des cookies.",
    cookie_accept: "J'accepte",
  },
  nl: {
    cookie_consent:
      "Deze site maakt gebruik van cookies om de noodzakelijke websitefunctionaliteit te bieden, uw ervaring te verbeteren en ons verkeer te analyseren. Door onze website te gebruiken, gaat u akkoord met ons privacybeleid en ons gebruik van cookies.",
    cookie_accept: "Aanvaarden",
  },
};

export class CookieConsent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
    this.onAccept = this.onAccept.bind(this);
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
    const { cookieName } = this.props;
    console.log("ddddddd");
    localStorage.setItem(cookieName, true);
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    let { lng } = this.props;
    if (!lng) {
      lng = "fr";
    }

    return !visible ? null : (
      <div className={styles.container}>
        <span className={styles.text}>{I18N[lng]["cookie_consent"]}</span>
        <button className={styles.button} onClick={this.onAccept}>
          {I18N[lng]["cookie_accept"]}
        </button>
      </div>
    );
  }
}
