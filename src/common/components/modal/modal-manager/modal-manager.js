"use client";
import React from "react";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect } from "react";
import Modal from "react-modal";
// import { ModalEventBookRegistration } from '../modal-event-book-registration';
import { useModal } from "../use-modal";
import ModalEventBookRegistration from "../modal-event-book-registration/modal-event-book-registration";
import ModalRegistrationType from "../modal-registration-type/modal-registration-type";
import ModalFiduciaireRegistrationType from "../modal-fiduciaire-registration-type/modal-fiduciaire-registration-type";

Modal.setAppElement("body");

export default function ModalManager() {
  const { modal, closeModal } = useModal();
  const pathname = useLocation().pathname;

  const handleCloseModal = useCallback(() => {
    // modal.onClose();
    closeModal();
  }, [modal]);

  useEffect(() => {
    if (modal.isOpen) {
      closeModal();
    }
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", modal.isOpen);

    if (modal.isOpen) {
      window.parent.postMessage(
        {
          event: "OPEN_MODAL",
        },
        "*"
      );
    }

    if (!modal.isOpen) {
      window.parent.postMessage(
        {
          event: "CLOSE_MODAL",
        },
        "*"
      );
    }
  }, [modal.isOpen]);

  if (!modal.isOpen) {
    return null;
  }
  switch (modal.modalId) {
    case "EVENT_BOOK_REGISTRATION":
      return (
        <ModalEventBookRegistration
          modal={modal}
          onCloseModal={handleCloseModal}
        />
      );
    case "REGISTRATION_TYPE":
      return (
        <ModalRegistrationType modal={modal} onCloseModal={handleCloseModal} />
      );
    case "FIDUCIAIRE_REGISTRATION_TYPE":
      return (
        <ModalFiduciaireRegistrationType
          modal={modal}
          onCloseModal={handleCloseModal}
        />
      );
    default:
      return null;
  }
}
