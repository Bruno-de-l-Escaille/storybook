import React from "react";
import styles from "./EventLayoutHover.module.scss";
import IconHash from "../../CycleCard/assets/IconHash";
import IconCalendarWhite from "../assets/IconCalendarWhite";

export default function EventLayoutHover({
  setShowAddTags,
  showAddTags,
  setShowFocusConfig,
  showFocusConfig,
  isEvent,
}) {
  return (
    <div className={styles.eventLayoutHover}>
      {isEvent && (
        <button
          className={styles.tagsAddButton}
          onClick={() => setShowAddTags(!showAddTags)}
        >
          <IconHash width="17px" height="20px" />
        </button>
      )}
      <button
        className={styles.tagsAddButton}
        onClick={() => setShowFocusConfig(!showFocusConfig)}
      >
        <IconCalendarWhite width="17px" height="20px" />
      </button>
    </div>
  );
}
