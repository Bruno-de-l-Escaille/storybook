import classNames from "classnames";
// import Image from "next/image";
import React from "react";
import styles from "./avatar.module.scss";
import { getUserNameForAvatar } from "../../../../../../utils";

export default function Avatar({
  url,
  firstName,
  lastName,
  theme = "darkBlue",
  size = 36,
  showInfos = true,
  className,
  fontSize,
  isCyclePage,
}) {
  const userNameForAvatar = getUserNameForAvatar(firstName, lastName);
  const calculatedFontSize = userNameForAvatar.length > 2 ? "10px" : fontSize;

  return (
    <span
      className={classNames(styles.avatar_container, className, styles[theme])}
    >
      <div
        className={
          url && !url.endsWith("//") ? styles.avatar : styles.emptyAvatar
        }
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
        }}
      >
        {url && !url.endsWith("//") ? (
          <img
            src={url}
            alt={`${firstName}-${lastName} avatar`}
            width={size - 4}
            height={size - 4}
            className={styles.image}
          />
        ) : (
          <span style={{ fontSize: isCyclePage ? "3rem" : calculatedFontSize }}>
            {userNameForAvatar}
          </span>
        )}
      </div>
      {!!showInfos && (
        <div className={styles.infos}>
          <span className={styles.name}>{firstName}</span>
          <span className={styles.name}>{lastName}</span>
        </div>
      )}
    </span>
  );
}
