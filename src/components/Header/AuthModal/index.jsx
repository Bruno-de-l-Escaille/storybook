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

const AuthModal = ({ env, lng, app }) => {
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("LOGIN"); // LOGIN | REGISTER | RESET_PASSWORD
  const [email, setEmail] = useState("");
  const [resetParams, setResetParams] = useState(null);
  const [clientToken, setClientToken] = useState("");
  const [showForgotCheckEmail, setShowForgotCheckEmail] = useState(false);
  const [showForgotStep, setShowForgotStep] = useState(false);

  useEffect(() => {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("authView")) {
      if (searchParams.get("authView") === "REGISTER") {
        setView("REGISTER");
        setShowModal(true);
      } else if (searchParams.get("authView") === "resetPassword") {
        setShowForgotStep(true);
        setShowModal(true);
      } else if (searchParams.get("authView") === "LOGIN") {
        setView("LOGIN");
        setShowModal(true);
      }
      searchParams.delete("authView");
      let searchString =
        searchParams.toString().length > 0 ? "?" + searchParams.toString() : "";
      let newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        searchString +
        window.location.hash;
      window.history.replaceState(null, "", newUrl);
    }
  }, []);

  const handleAuthTokenUser = async (data) => {
    const currentParams = new URLSearchParams(window.location.search);
    const gotoUrl = currentParams.get("gotoUrl");

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
      if (gotoUrl) {
        s += `&gotoUrl=${encodeURIComponent(gotoUrl)}`;
      }
      window.location.href = app.autoLoginUrl + "?auth=" + s;
    } else if (app.autoLoginUrl) {
      const { sha256 } = require("js-sha256");
      const salt = "Aqwxsz32$";
      const time = Math.floor(new Date().getTime() / 1000);
      const hashKey = sha256(
        data.data.user.email + time + data.token.access_token + salt
      );
      const params = new URLSearchParams({
        email: data.data.user.mainEmail,
        time,
        token: data.token.access_token,
        expiresIn: data.token.expires_in,
        createdAt: data.token.createdAt,
        id: data.data.user.id,
        key: hashKey,
        app: app.authAppName,
      });
      if (gotoUrl) {
        params.append("gotoUrl", gotoUrl);
      }
      window.location.href = app.autoLoginUrl + "?" + params.toString();
    }
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
        {I18N[lng].auth.signInUp}
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
            showForgotStep={showForgotStep}
            showForgotCheckEmail={showForgotCheckEmail}
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
            showForgotResetPassword={(e) => {
              setEmail(e);
              setShowForgotCheckEmail(true);
              setView("LOGIN");
            }}
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
