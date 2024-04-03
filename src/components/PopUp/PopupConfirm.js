import React from "react";
import Modal from "react-modal";
import IconLock from "../Icons/Lock";
import IconUnlock from "../Icons/Unlock";
import IconLoader from "../Icons/IconLoader";
import styles from "./PopupConfirm.module.scss";

export const PopupConfirm = (props) => {
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
    period = "",
  } = props;
  const renderMainIcon = () => {
    switch (type) {
      case "lock":
        return <IconLock />;
      case "unlock":
        return <IconUnlock />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={{
        base: styles.popupContent,
        afterOpen: styles.popupContentAfterOpen,
        beforeClose: styles.popupContentBeforeClose,
      }}
      overlayClassName={styles.popupOverlay}
      closeTimeoutMS={200}
    >
      <div className={`${styles.confirm} ${styles[type]}`}>
        <div className={styles.header}>
          <div className={styles.icon}>{renderMainIcon()}</div>
        </div>
        <div className={styles.body}>
          {period === "" ? (
            <>
              {text} {" ?"}
            </>
          ) : (
            <>
              {text} ({period}) {" ?"}
            </>
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
