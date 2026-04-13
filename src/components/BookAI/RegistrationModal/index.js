import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import styles from "./RegistrationModal.module.scss";
import { BookRegistartaion } from "../registration/book-registration/book-registration";
import { RegistrationType } from "../registration/registration-type";
import { RegistrationFiduciaireType } from "../registration/registration-fiduciaire-type";

// Modal.setAppElement("#modals");

const RegistrationModal = ({
  token,
  product,
  user,
  language,
  env,
  fiduciaires,
  showModal,
  setShowModal,
  showFiduciareModal,
}) => {
  const modalType = (fiduciaires) => {
    if (!showFiduciareModal) {
      return "BOOK";
    }

    if (fiduciaires && fiduciaires.length > 0) {
      return "TYPE";
    } else {
      return "BOOK";
    }
  };
  const [view, setView] = useState(modalType(fiduciaires));
  const [fiduciaire, setFiduciaire] = useState(null);

  useEffect(() => {
    setShowModal(true);
    setView(modalType(fiduciaires));
  }, [fiduciaires, setShowModal]);
  console.log("view", view);
  const handleCloseModal = () => {
    setShowModal(false);
    // setView("LOGIN");
    // const updatedSearchParams = new URLSearchParams(searchParams);
    // updatedSearchParams.delete("source");
    // router.push(`${pathname}?${updatedSearchParams}`);
  };

  // if (user) {
  //   return <MenuProfile user={user} language={language} onLogoutClick={handleLogout} />;
  // }
  console.log("show", showModal);
  return (
    <>
      {/* <div className={styles.signIn} onClick={() => setShowModal(true)}>
        {I18N[language].auth.signInUp}
      </div> */}

      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        className={styles.modal}
        overlayClassName={styles.overlay}
        bodyOpenClassName={styles.bodyOpen}
      >
        {view === "TYPE" && (
          <RegistrationType
            setType={setView}
            language={language}
            closeModal={handleCloseModal}
          />
        )}
        {view === "BOOK" && (
          <BookRegistartaion
            product={product}
            token={token}
            user={user}
            language={language}
            env={env}
            fiduciaire={fiduciaire}
            closeModal={handleCloseModal}
          />
        )}
        {view === "FIDUCIAIRE" && (
          <RegistrationFiduciaireType
            product={product}
            token={token}
            user={user}
            language={language}
            env={env}
            fiduciaires={fiduciaires}
            setFiduciaire={setFiduciaire}
            setView={setView}
            closeModal={handleCloseModal}
          />
        )}
      </Modal>
    </>
  );
};

export default RegistrationModal;
