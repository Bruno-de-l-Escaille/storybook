import React from "react";
import classNames from "classnames";
import { ReactComponent as CloseIcon } from "./assets/close-inner.svg";
import styles from "./close-modal.module.scss";
import { useResponsive } from "../../../hooks/useResponsive";

export default function CloseModalInner({ onClose, className = "" }) {
  const { isMobile } = useResponsive();
  const size = isMobile ? 10 : 16;
  return (
    <div onClick={onClose} className={classNames(styles.closeModal, className)}>
      <CloseIcon fill="#fff" viewBox="0 0 16 16" width={size} height={size} />
    </div>
  );
}
