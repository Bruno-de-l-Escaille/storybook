import React from "react";

import styles from "./FooterUA.module.scss";

const footerUA = ({ auth, data, lng, portalSwitch, navigateTo }) => {
  const titleAttr = `title${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.logos}>
          <div
            className={styles.uaLogo}
            style={{
              backgroundImage:
                'url("https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/logo/ua.png")',
            }}
          ></div>

          {auth.navCommunity && (
            <div
              className={styles.communityLogo}
              style={{
                backgroundImage: `url(${auth.navCommunity.avatarUrl})`,
              }}
            ></div>
          )}
        </div>
        {auth.user.isUaAdmin && (
          <div className={styles.section}>
            <ul>
              {portalSwitch.map((el) => (
                <li onClick={() => navigateTo(el.url, "ua")}>
                  <div className={styles.block}></div>
                  {el.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.section}>
          <ul>
            <li>
              <div className={styles.block}></div>
              {"terms_of_use"}
            </li>
            <li>
              <div className={styles.block}></div>
              {"privacy_policy"}
            </li>
          </ul>
        </div>
        {data && (
          <div className={styles.section}>
            <ul>
              {data.map((rubric) => (
                <li onClick={() => navigateTo(rubric.id, "faq")}>
                  <div className={styles.block}></div>
                  {rubric.versions[0][titleAttr]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.copyright}>
        © Copyright -{new Date().getFullYear()} Tamtam International
      </div>
    </div>
  );
};

export default footerUA;
