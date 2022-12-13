import classNames from "classnames";
import React, { Component } from "react";

import styles from "./FooterUA.module.scss";

export class FooterUA extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
    const {
      navigateTo,
      primaryLogo,
      secondaryLogo,
      firstList,
      secondList,
      thirdList,
      fourthList,
    } = this.props;

    return (
      <div className={styles.footer}>
        <div className={classNames(styles.content, "grid-x")}>
          <div
            className={classNames(
              styles.logos,
              "cell small-12 medium-6 large-3"
            )}
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
                className={
                  primaryLogo ? styles.communityLogo : styles.communityLogoLarge
                }
                style={{
                  backgroundImage: `url(${secondaryLogo})`,
                }}
              ></div>
            )}
          </div>
          <div className="grid-x cell small-12 medium-6 large-9">
            {firstList && (
              <div
                className={classNames(
                  styles.section,
                  fourthList
                    ? "cell small-12 medium-6 large-3"
                    : "cell small-12 medium-6 large-4"
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
                  fourthList
                    ? "cell small-12 medium-6 large-3"
                    : "cell small-12 medium-6 large-4"
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
                  fourthList
                    ? "cell small-12 medium-6 large-3"
                    : "cell small-12 medium-6 large-4"
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
            {fourthList && (
              <div
                className={classNames(
                  styles.section,
                  fourthList
                    ? "cell small-12 medium-6 large-3"
                    : "cell small-12 medium-6 large-4"
                )}
              >
                <ul>
                  {fourthList.map((el) => (
                    <li onClick={() => navigateTo(el.url)}>
                      <div className={styles.block}></div>
                      {el.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className={styles.copyright}>
          © Copyright -{new Date().getFullYear()} Tamtam International
        </div>
      </div>
    );
  }
}
