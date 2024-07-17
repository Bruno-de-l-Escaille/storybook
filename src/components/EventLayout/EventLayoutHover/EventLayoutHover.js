import React from "react";
import HashIcon from "../assets/hash.svg";
import styles from "./EventLayoutHover.module.scss";

export default function EventLayoutHover({ setShowAddTags, showAddTags }) {
  return (
    <div className={styles.eventLayoutHover}>
      <button
        className={styles.tagsAddButton}
        onClick={() => setShowAddTags(!showAddTags)}
      >
        <HashIcon width="17px" height="20px" />
      </button>
    </div>
  );
}
