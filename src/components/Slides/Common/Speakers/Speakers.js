import React from "react";
import cn from "classnames";
import styles from "./Speakers.module.scss";
import { getUserNameForAvatar } from "../../../../utils";

export const Speakers = ({ speakers, className }) => {
  const size = 36;

  const renderSpeaker = (speaker) => {
    const firstName = speaker.firstName;
    const lastName = speaker.lastName;
    const avatarUrl = speaker.pictureUrl || speaker.avatarUrl;
    return (
      <span className={cn(styles.speaker)}>
        <div
          className={avatarUrl ? styles.avatar : styles.emptyAvatar}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            minWidth: `${size}px`,
            minHeight: `${size}px`,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${firstName}-${lastName} avatar`}
              width={size - 4}
              height={size - 4}
              className={styles.image}
            />
          ) : (
            <span>{getUserNameForAvatar(firstName, lastName)}</span>
          )}
        </div>
        <div className={styles.infos}>
          <span className={styles.name}>{firstName}</span>
          <span className={styles.name}>{lastName}</span>
        </div>
      </span>
    );
  };

  return (
    <div className={cn(styles.speakers, className)}>
      {speakers.map((speaker) => renderSpeaker(speaker))}
    </div>
  );
};
