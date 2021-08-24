import React from "react";
import Modal from "react-modal";

import IconTrash from "../Icons/IconTrash";
import IconSend from "../Icons/IconSend";
import IconClose from "../Icons/IconClose";
import IconLoader from "../Icons/IconLoader";
import IconMegaphone from "../Icons/IconMegaphone";

import styles from "./ModalConfirm.module.scss";

export const ModalConfirm = (props) => {
  const {
    type,
    isOpen,
    onCancel,
    onConfirm,
    inProcess,
    actionFailed,
    labelError = "Error",
    labelNo = "No",
    labelYes = "Yes",
    text = "",
    title,
  } = props;

  const renderMainIcon = () => {
    switch (type) {
      case "publish":
        return <IconMegaphone />;
      case "send":
        return <IconSend />;
      case "delete":
        return <IconTrash />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={{
        base: styles.modalContent,
        afterOpen: styles.modalContentAfterOpen,
        beforeClose: styles.modalContentBeforeClose,
      }}
      overlayClassName={styles.modalOverlay}
      closeTimeoutMS={200}
    >
      <div className={`${styles.confirm} ${styles[type]}`}>
        <div className={styles.header}>
          {title}
          <div className={styles.icon}>{renderMainIcon()}</div>
        </div>
        <div className={styles.close} onClick={onCancel}>
          <IconClose width={14} />
        </div>
        <div className={styles.body}>{text}</div>
        <div className={styles.footer}>
          <button className={styles.no} onClick={onCancel}>
            {labelNo}
          </button>
          {!inProcess && !actionFailed && (
            <button className={styles.yes} onClick={onConfirm}>
              {labelYes}
            </button>
          )}
          {inProcess && !actionFailed && (
            <div className={styles.deleting}>
              <IconLoader />
            </div>
          )}
          {!inProcess && actionFailed && (
            <div className={styles.deleting}>{labelError}</div>
          )}
        </div>
      </div>
    </Modal>
  );
};
