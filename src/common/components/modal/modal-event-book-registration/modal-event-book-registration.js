import React, { memo, useEffect } from "react";
import Modal from "react-modal";
import s from "./modal-event-book-registration.module.scss";
import { BookRegistartaion } from "../../book-registration/book-registration";
import CloseModalInner from "../close-modal/close-modal-inner";

export default memo(({ modal, onCloseModal }) => {
  const { product, token, user, language, env, fiduciaire } = modal.data;
  useEffect(() => {
    const handler = (e) => {
      if (e?.data?.message === "CLOSE_REGISTRATION_MODAL") {
        if (modal.onSuccess) {
          modal.onSuccess();
        }
        onCloseModal();
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [modal]);

  return (
    <Modal
      isOpen={modal.isOpen}
      onRequestClose={onCloseModal}
      shouldCloseOnOverlayClick={false}
      className={s.modal_content}
    >
      <CloseModalInner onClose={onCloseModal} />
      <BookRegistartaion
        product={product}
        token={token}
        user={user}
        language={language}
        env={env}
        fiduciaire={fiduciaire}
      />
    </Modal>
  );
});
