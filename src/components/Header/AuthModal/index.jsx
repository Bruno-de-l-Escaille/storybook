import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FlashMessage } from "../../ToastContainer/ToastContainer";

import { I18N } from "../../../i18n";
import Login from "./Login";
import Register from "./Register";
import styles from "./AuthModal.module.scss";
// import MenuProfile from "./MenuProfile";
import ResetPassword from "./ResetPassword";

// Modal.setAppElement("#modals");

const AuthModal = ({
  env,
  lng,
  setUser,
  setToken,
  setCreatedAt,
  setExpiresIn,
  app,
}) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("LOGIN"); // LOGIN | REGISTER | RESET_PASSWORD
  const [email, setEmail] = useState("");
  const [resetParams, setResetParams] = useState(null);
  const [clientToken, setClientToken] = useState("");

  // useEffect(() => {
  //   if (searchParams.get("source")) {
  //     if (searchParams.get("source") === "REGISTER") {
  //       setView("REGISTER");
  //       setShowModal(true);
  //     } else if (searchParams.get("source") === "resetPassword") {
  //       setView("RESET_PASSWORD");
  //       setShowModal(true);
  //     } else if (searchParams.get("source") === "LOGIN") {
  //       setView("LOGIN");
  //       setShowModal(true);
  //     }
  //   }
  // }, [searchParams]);

  const handleAuthTokenUser = async (data) => {
    if (app.withAuthLogin) {
      const userAuth = {
        id: data.data.user.id,
        token: data.token.access_token,
        expiresIn: data.token.expires_in,
        createdAt: data.token.createdAt,
        extra: {
          lang: data.data.user.language,
          env,
        },
      };
      var b = Buffer.from(JSON.stringify(userAuth));
      var s = b.toString("base64");
      window.location.href = app.appUrl + "?auth=" + s;
    }
  };

  const handleLogout = async (e) => {
    // await logoutAction();
    setUser(null);
    setToken("");
    setExpiresIn("");
    setCreatedAt("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setView("LOGIN");
    // const updatedSearchParams = new URLSearchParams(searchParams);
    // updatedSearchParams.delete("source");
    // router.push(`${pathname}?${updatedSearchParams}`);
  };

  // if (user) {
  //   return <MenuProfile user={user} lng={lng} onLogoutClick={handleLogout} />;
  // }

  return (
    <>
      <div className={styles.signIn} onClick={() => setShowModal(true)}>
        {I18N[lng].auth.signin}
      </div>

      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <FlashMessage />
        {view === "LOGIN" && (
          <Login
            env={env}
            app={app}
            i18n={I18N[lng]}
            closeModal={handleCloseModal}
            showRegister={() => setView("REGISTER")}
            handleAuthTokenUser={handleAuthTokenUser}
            clientToken={clientToken}
            setClientToken={setClientToken}
            initialEmail={email}
            showResetPassword={(e) => {
              setResetParams(e);
              setView("RESET_PASSWORD");
            }}
          />
        )}
        {view === "REGISTER" && (
          <Register
            app={app}
            i18n={I18N[lng]}
            lng={lng}
            closeModal={handleCloseModal}
            showLogin={() => setView("LOGIN")}
            showLoginWithEmail={(e) => {
              setEmail(e);
              setView("LOGIN");
            }}
            handleAuthTokenUser={handleAuthTokenUser}
            clientToken={clientToken}
            setClientToken={setClientToken}
            handleLogout={handleLogout}
          />
        )}
        {view === "RESET_PASSWORD" && (
          <ResetPassword
            {...resetParams}
            app={app}
            i18n={I18N[lng]}
            lng={lng}
            closeModal={handleCloseModal}
            showLogin={() => setView("LOGIN")}
            handleAuthTokenUser={handleAuthTokenUser}
            clientToken={clientToken}
            setClientToken={setClientToken}
          />
        )}
      </Modal>
    </>
  );
};

export default AuthModal;
