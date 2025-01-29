import React, { useState } from "react";
import styles from "./Tag.module.scss";
import { getByLanguage } from "../../../utils";
import IconCross from "../../CycleCard/assets/IconCross";
import TagEdit from "../TagEdit/TagEdit";
import Modal from "react-modal";

export default function Tag({
  tag,
  setDeletedTagId,
  tags,
  action,
  language,
  token,
  apiUrl,
  env,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tagName =
    tag?.isSuperTag == true
      ? `⚡︎ ${getByLanguage(tag, "name", language)}`
      : getByLanguage(tag, "name", language);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.tag}>
      <div className={styles.dismissContainer} onClick={handleClick}>
        <p className={styles.tagName}>{tagName}</p>
      </div>
      <div
        onClick={() => setDeletedTagId(tag.id)}
        className={styles.dismissContainer}
      >
        <IconCross className={styles.tagDismiss} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        shouldCloseOnOverlayClick={false}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <TagEdit
          tag={tag}
          tags={tags}
          action={action}
          language={language}
          handleModalClose={handleModalClose}
          token={token}
          apiUrl={apiUrl}
          env={env}
        />
      </Modal>
    </div>
  );
}
