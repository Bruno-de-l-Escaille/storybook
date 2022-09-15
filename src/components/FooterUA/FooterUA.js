import classNames from "classnames";
import React from "react";

import styles from "./FooterUA.module.scss";

const FooterUA = ({
  navigateTo,
  primaryLogo,
  secondaryLogo,
  firstList,
  secondList,
  thirdList,
}) => {
  return (
    <div className={styles.footer}>
      <div className={classNames(styles.content, "grid-x")}>
        <div
          className={classNames(styles.logos, "cell small-12 medium-6 large-3")}
        >
          {primaryLogo && (
            <div
              className={styles.uaLogo}
              style={{
                backgroundImage: `url(${primaryLogo})`,
              }}
            ></div>
          )}

          {secondaryLogo && (
            <div
              className={styles.communityLogo}
              style={{
                backgroundImage: `url(${secondaryLogo})`,
              }}
            ></div>
          )}
        </div>
        {firstList && (
          <div
            className={classNames(
              styles.section,
              "cell small-12 medium-6 large-3"
            )}
          >
            <ul>
              {firstList.map((el) => (
                <li onClick={() => navigateTo(el.url)}>
                  <div className={styles.block}></div>
                  {el.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        {secondList && (
          <div
            className={classNames(
              styles.section,
              "cell small-12 medium-6 large-3"
            )}
          >
            <ul>
              {secondList.map((el) => (
                <li onClick={() => navigateTo(el.url)}>
                  <div className={styles.block}></div>
                  {el.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        {thirdList && (
          <div
            className={classNames(
              styles.section,
              "cell small-12 medium-6 large-3"
            )}
          >
            <ul>
              {thirdList.map((el) => (
                <li onClick={() => navigateTo(el.url)}>
                  <div className={styles.block}></div>
                  {el.label}
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

export default FooterUA;
