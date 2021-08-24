import React from "react";

import MenuItem from "./MenuItem";
import styles from "./Header.module.scss";

const I18N = {
  en: {
    apps: "TAMTAM applications",
  },
  fr: {
    apps: "Applications TAMTAM",
  },
  nl: {
    apps: "TAMTAM-toepassingen",
  },
};

export default function Apps({ apps, language = "fr" }) {
  return (
    <MenuItem icon="Apps" className={styles.apps}>
      <div className={styles.socialLinksWrapper}>
        <div className={styles.socialLinksHeader}>{I18N[language]["apps"]}</div>
        <div className={styles.socialLinksBody}>
          <ul className={styles.appsContainer}>
            {apps.map(({ code, url, activated, icon, name }) => (
              <li key={"app-" + code} className={styles.appsColumn}>
                {activated ? (
                  <a className={styles.appWrapper} href={url}>
                    <img alt="" src={`${icon}`} />
                    <div className={styles.appName}>{name[language]}</div>
                  </a>
                ) : (
                  <span className={`${styles.appWrapper} ${styles.disabled}`}>
                    <img alt="" src={`${icon}`} />
                    <div className={styles.appName}>{name[language]}</div>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MenuItem>
  );
}
