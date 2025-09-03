import React, { memo } from "react";
import Modal from "react-modal";
import s from "./modal-fiduciaire-registration-type.module.scss";
import CloseModalInner from "../close-modal/close-modal-inner";
import { RegistrationFiduciaireType } from "../../registration/registration-fiduciaire-type";

export default memo(({ modal, onCloseModal }) => {
  const { product, token, user, language, env, fiduciaires } = modal.data;
  return (
    <Modal
      isOpen={modal.isOpen}
      onRequestClose={onCloseModal}
      shouldCloseOnOverlayClick={false}
      className={s.modal_content}
    >
      <CloseModalInner onClose={onCloseModal} />
      <RegistrationFiduciaireType
        product={product}
        token={token}
        user={user}
        language={language}
        env={env}
        fiduciaires={fiduciaires}
      />
    </Modal>
  );
});
