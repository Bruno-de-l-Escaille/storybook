import React from "react";
// import { SVG_ICONS } from "../../config/Common";
import * as icons from "../Icons";
import styles from "./Header.module.scss";

export const SVG_ICONS = {
  //MainMenu
  PROFILE: "profile.svg",
  NOTIFS: "notifs.svg",
  APPS: "apps.svg",
  EBOX: "ebox.svg",
};

export default function MenuItem({
  href,
  icon,
  children,
  count = 0,
  className = "",
}) {
  const Icon = icons[icon];
  return (
    <li
      className={`${styles.socialLinks} ${
        children ? styles.expandable : ""
      } ${className}`}
    >
      <a href={href}>
        <Icon />
      </a>
      {children}
      {/* {count ? <span className="badge">{count > 99 ? '99+' : count }</span> : null} */}
    </li>
  );
}
