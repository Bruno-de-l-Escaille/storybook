import React from "react";
import MenuItem from "./MenuItem";
import styles from "./Header.module.scss";

export default function Apps({ apps, language = "fr" }) {
  return (
    <MenuItem icon="Apps" className={styles.apps}>
      <div className={styles.socialLinksWrapper}>
        <div className={styles.socialLinksHeader}> TAMTAM applications </div>
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
                  <div className={`${styles.appWrapper} ${styles.disabled}`}>
                    <img alt="" src={`${icon}`} />
                    <div className={styles.appName}>{name[language]}</div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MenuItem>
  );
}
