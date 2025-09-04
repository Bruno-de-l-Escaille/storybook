import React, { memo } from "react";
import Modal from "react-modal";
import s from "./modal-registration-type.module.scss";
import CloseModalInner from "../close-modal/close-modal-inner";
import { RegistrationType } from "../../registration/registration-type";

export default memo(({ modal, onCloseModal }) => {
  const { data } = modal;

  return (
    <Modal
      isOpen={modal.isOpen}
      onRequestClose={onCloseModal}
      shouldCloseOnOverlayClick={false}
      className={s.modal_content}
    >
      <CloseModalInner onClose={onCloseModal} />
      <RegistrationType {...data} />
    </Modal>
  );
});
