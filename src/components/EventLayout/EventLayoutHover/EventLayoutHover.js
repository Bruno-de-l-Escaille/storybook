import React from "react";
import styles from "./EventLayoutHover.module.scss";
import IconHash from "../../CycleCard/assets/IconHash";

export default function EventLayoutHover({ setShowAddTags, showAddTags }) {
  return (
    <div className={styles.eventLayoutHover}>
      <button
        className={styles.tagsAddButton}
        onClick={() => setShowAddTags(!showAddTags)}
      >
        <IconHash width="17px" height="20px" />
      </button>
    </div>
  );
}
