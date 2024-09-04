import classNames from "classnames";
import React from "react";
import styles from "./CycleCard.module.scss";
import EarthIcon from "../Icons/Earth";
import CalendarIcon from "../Icons/Calendar";

export const Fetching = () => {
  const renderCard = () => {
    return (
      <div
        className={classNames(styles.event, styles.fetching)}
        style={{ width: "305px", height: "318px" }}
      >
        <div className={classNames(styles.banner, "m-b-m")} />
        <h3 className="m-l-xs m-b-xxs" />
        <div className={classNames(styles.speakers, "greetings")}>
          <h6 className="m-l-xs" />
        </div>
        <div className={styles.infos}>
          <ul className="m-l-xs">
            <li>
              <CalendarIcon />,
              <span>
                <h3 />
              </span>
            </li>
            <li>
              <EarthIcon />,
              <span>
                <h3 />
              </span>
            </li>
          </ul>
        </div>
        <div className="m-t-auto">
          <div className={styles.mainActions} />
        </div>
      </div>
    );
  };
  return renderCard();
};
