import React from "react";
import Modal from "react-modal";

import IconTrash from "../Icons/IconTrash";
import IconSend from "../Icons/IconSend";
import IconClose from "../Icons/IconClose";
import IconLoader from "../Icons/IconLoader";
import IconMegaphone from "../Icons/IconMegaphone";
import IconDuplicate from "../Icons/IconDuplicate";
import IconCircleClose from "../Icons/IconCircleClose";
import IconShare from "../Icons/IconShare";
import IconAdd from "../Icons/IconAdd";
import IconPadlock from "../Icons/IconPadlock";

import styles from "./ModalConfirm.module.scss";
import classnames from "classnames";

export const ModalConfirm = (props) => {
  const {
    type,
    isOpen,
    onCancel,
    onConfirm,
    onSwitch,
    inProcess,
    actionFailed,
    labelError = "Error",
    labelNo = "No",
    labelYes = "Yes",
    text = "",
    secondText = "",
    title,
    isChecked,
  } = props;

  const renderMainIcon = () => {
    switch (type) {
      case "publish":
        return <IconMegaphone />;
      case "send":
        return <IconSend />;
      case "delete":
        return <IconTrash />;
      case "duplicate":
        return <IconDuplicate />;
      case "return":
        return <IconCircleClose />;
      case "share":
        return <IconShare />;
      case "add":
        return <IconAdd />;
      case "privatize":
        return <IconPadlock />;
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
        <div
          className={classnames(
            styles.body,
            isChecked != null ? styles.with_switch : ""
          )}
        >
          {text}
          {isChecked != null && (
            <div className={styles.item}>
              <span className={styles.itemLabel}>{secondText}</span>
              <label>
                <input
                  name="switch"
                  checked={isChecked}
                  onChange={onSwitch}
                  className={styles.switch}
                  type="checkbox"
                />
                <div className={styles.switch_frame}>
                  <div className={styles.switch_handle} />
                </div>
              </label>
            </div>
          )}
        </div>
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
