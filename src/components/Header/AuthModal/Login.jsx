import React, { useEffect, useState } from "react";
import classNames from "classnames";
import ReactCodeInput from "react-code-input";

import FormInput from "../../common/FormInput";
import Loader from "../../common/Loader";
import { Toast } from "../../ToastContainer/ToastContainer";

import {
  postUserCredential,
  getClientCredential,
  resetPassword,
  postValidateEmailCode,
} from "../../../api";
import { validateEmail, cleanEmail } from "./utils";
import { IconCheckCircle } from "./consts";

import styles from "./AuthModal.module.scss";

const Login = ({
  env,
  app,
  i18n,
  closeModal,
  showRegister,
  clientToken,
  setClientToken,
  handleAuthTokenUser,
  initialEmail,
  showResetPassword,
  showForgotCheckEmail = false,
  showForgotStep,
  hideRegister = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(showForgotStep);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(showForgotCheckEmail);
  const [keyValidation, setKeyValidation] = useState("");
  const [showCodeError, setShowCodeError] = useState(false);
  const [typePassword, setTypePassword] = useState("password");

  useEffect(() => {
    if (showForgot && clientToken === "") {
      setIsSaving(true);
      getClientCredential(app.apiUrl, app.clientCredential)
        .then((resp) => {
          const token = resp.data.token.access_token;
          setClientToken(token);
          setIsSaving(false);
        })
        .catch((e) => {
          setIsSaving(false);
        });
    }
  }, [showForgot]);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleBlurEmail = (e) => {
    if (!validateEmail(cleanEmail(email))) {
      setErrors({ ...errors, email: i18n.auth.validate_email });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handleBlurPwd = (e) => {
    if (e.target.value.length < 0) {
      setErrors({ ...errors, password: "Length error" });
    } else {
      setErrors({ ...errors, password: "" });
    }
  };

  const validateEmailCode = () => {
    if (keyValidation.length < 6) {
      setShowCodeError(true);
      return null;
    }
    setShowCodeError(false);
    setIsSaving(true);
    const emailStr = cleanEmail(email);
    postValidateEmailCode({
      apiUrl: app.apiUrl,
      token: clientToken,
      email: emailStr,
      key: keyValidation,
      source: "reset",
    })
      .then((resp) => {
        setIsSaving(false);
        showResetPassword({ emailKey: resp.data.data.key, email: emailStr });
      })
      .catch((e) => {
        setIsSaving(false);
        Toast.error(i18n.auth.invalid_code);
      });
  };

  const validate = () => {
    let success = true;
    if (!validateEmail(cleanEmail(email))) {
      setErrors({ ...errors, email: i18n.auth.validate_email });
      success = false;
    }
    if (password.length <= 0) {
      setErrors({ ...errors, password: i18n.auth.validate_password });
      success = false;
    }
    return success;
  };

  const handleResetPassword = (tok) => {
    if (!validateEmail(cleanEmail(email))) {
      setErrors({ ...errors, email: i18n.auth.validate_email });
      return null;
    }

    setIsSaving(true);
    resetPassword(app.apiUrl, clientToken || tok, email, app.authAppName)
      .then((response) => {
        setShowCheckEmail(true);
        setIsSaving(false);
      })
      .catch((e) => {
        if (
          e.response &&
          e.response.data &&
          e.response.data.errors &&
          e.response.data.errors.message
        ) {
          Toast.error(e.response.data.errors.message);
        } else {
          if (e?.response?.status >= 500) {
            Toast.error(i18n.auth.server_error);
          } else {
            Toast.error(i18n.auth.error);
          }
        }
        setIsSaving(false);
      });
  };

  const handleLogin = () => {
    if (!validate()) {
      return null;
    }

    let data = {
      email: cleanEmail(email),
      password,
    };

    setIsSaving(true);
    postUserCredential(app.apiUrl, data, app.clientCredential)
      .then((resp) => {
        handleAuthTokenUser(resp.data);

        // setIsSaving(false);
        // closeModal();
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          Toast.error(i18n.auth.invalid_credentials);
        } else {
          if (e?.response?.status >= 500) {
            Toast.error(i18n.auth.server_error);
          } else {
            Toast.error(i18n.auth.error);
          }
        }
        setIsSaving(false);
      });
  };

  return (
    <div>
      <div className={styles.modalHeader}>
        {i18n.auth.signin}
        <span className={styles.modalClose} onClick={closeModal}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.85888 7.99949L6.50533 7.64594L0.959195 2.09981C0.643914 1.78453 0.64395 1.2734 0.959169 0.958228L0.959195 0.958202C1.27446 0.642936 1.78553 0.642936 2.1008 0.958202L7.64701 6.50441L8.00056 6.85796L8.35412 6.50441L13.9003 0.958129C13.9003 0.958129 13.9003 0.958128 13.9003 0.958127C14.2156 0.642872 14.7266 0.642864 15.0419 0.958104C15.0419 0.958112 15.0419 0.958121 15.0419 0.958129M6.85888 7.99949L15.0419 0.958129M6.85888 7.99949L6.50533 8.35305M6.85888 7.99949L6.50533 8.35305M15.0419 0.958129C15.3571 1.27342 15.3571 1.78456 15.0419 2.09973M15.0419 0.958129L15.0419 2.09973M15.0419 2.09973C15.0419 2.09973 15.0419 2.09973 15.0419 2.09973M15.0419 2.09973L15.0419 2.09973M15.0419 2.09973L9.49572 7.64587M15.0419 2.09973L9.49572 7.64587M6.50533 8.35305L0.959195 13.8992C0.643929 14.2144 0.643929 14.7255 0.959195 15.0408C1.27447 15.3561 1.7856 15.356 2.10077 15.0408L2.1008 15.0408L7.64701 9.49458L8.00056 9.14103L8.35411 9.49458L13.9003 15.0408C14.2156 15.3561 14.7267 15.3561 15.0419 15.0408C15.3571 14.7256 15.3571 14.2145 15.0419 13.8992C15.0419 13.8992 15.0419 13.8992 15.0419 13.8992L9.49572 8.35297L9.14216 7.99942M6.50533 8.35305L9.14216 7.99942M9.14216 7.99942L9.49572 7.64587M9.14216 7.99942L9.49572 7.64587"
              fill="#E9FFDE"
              stroke="#E9FFDE"
            />
          </svg>
        </span>
      </div>
      {!hideRegister && (
        <div className={styles.topBar}>
          <span>{i18n.auth.new}</span>
          <span onClick={showRegister} className={styles.topBar_link}>
            {i18n.auth.signup}
          </span>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.loginContent}>
          {showCheckEmail ? (
            <>
              <p className={styles.successMsg}>
                <IconCheckCircle size="80" />
                <span>{i18n.auth.reset_pwd_check_your_email}</span>
              </p>
              <p className={styles.emailCode}>{email}</p>
              <div className={styles.codeBox}>
                <p>Entrez le code reçu :</p>
                <ReactCodeInput
                  type="number"
                  fields={6}
                  value={keyValidation}
                  onChange={(value) => setKeyValidation(value)}
                  className={styles.codeInput}
                  inputStyle={{
                    marginRight: "0.463rem",
                    width: "34px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    height: "44px",
                    backgroundColor: "#F8F9FA",
                    border: "1px solid #B6BFC8",
                    textAlign: "center",
                  }}
                  autoFocus={false}
                />
                {showCodeError && (
                  <span className={styles.error}>Veuillez saisir le code</span>
                )}
              </div>
              <div className={styles.actions}>
                {isSaving ? (
                  <button className={styles.button}>
                    <Loader
                      style={{
                        height: "10px",
                      }}
                      color={"#fff"}
                    />
                  </button>
                ) : (
                  <button className={styles.button} onClick={validateEmailCode}>
                    {i18n.auth.send}
                  </button>
                )}
              </div>
              <div
                className={`${styles.signinLink} ${styles.footer}`}
                onClick={() => {
                  setShowForgot(false);
                  setShowCheckEmail(false);
                }}
              >
                {i18n.auth.signin}
              </div>
            </>
          ) : (
            <>
              <h1 className={styles.title}>
                {showForgot ? i18n.auth.forgotPassword : i18n.auth.signin}
              </h1>
              <FormInput
                name="email"
                value={email}
                label={i18n.auth.email}
                error={errors.email}
                className="sb-ttp-input-lg"
                labelClassName="sb-ttp-label-lg"
                autocomplete="username"
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleBlurEmail(e)}
              />

              {!showForgot ? (
                <>
                  <div className={styles.group}>
                    <label
                      className={classNames(
                        styles.flexLabel,
                        "sb-ttp-label-lg"
                      )}
                    >
                      <span>{i18n.auth.password}</span>

                      <span
                        className={styles.forgotLabel}
                        onClick={() => setShowForgot(true)}
                      >
                        {i18n.auth.forgot_password}
                      </span>
                    </label>
                    <div className={styles.pwdBox}>
                      <input
                        className={classNames(
                          "sb-ttp-input-lg",
                          styles.pwdInput,
                          errors.password ? styles.error : ""
                        )}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={(e) => handleBlurPwd(e)}
                        type={typePassword}
                        value={password}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleLogin();
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          setTypePassword(
                            typePassword === "password" ? "text" : "password"
                          );
                        }}
                        type="button"
                      >
                        {typePassword === "password" ? (
                          <svg
                            class="shrink-0 size-3.5"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line x1="2" x2="22" y1="2" y2="22"></line>
                          </svg>
                        ) : (
                          <svg
                            class="shrink-0 size-3.5"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className={styles.error}>{errors.password}</span>
                    )}
                  </div>

                  <div className={styles.columnActions}>
                    {isSaving ? (
                      <button className={styles.button}>
                        <Loader
                          style={{
                            height: "10px",
                          }}
                          color={"#fff"}
                        />
                      </button>
                    ) : (
                      <button
                        className={classNames(
                          styles.button
                          // password.length > 0 && styles.button_primary
                        )}
                        onClick={handleLogin}
                      >
                        {i18n.auth.signin}
                      </button>
                    )}
                  </div>
                  <p className={styles.initPass}>
                    {i18n.auth.init_password_p}{" "}
                    <span onClick={() => setShowForgot(true)}>
                      {i18n.auth.init_password_a}
                    </span>
                  </p>
                </>
              ) : (
                <div className={styles.actions}>
                  {isSaving ? (
                    <button className={styles.button}>
                      <Loader
                        style={{
                          height: "10px",
                        }}
                        color={"#fff"}
                      />
                    </button>
                  ) : (
                    <button
                      className={styles.button}
                      onClick={handleResetPassword}
                    >
                      {i18n.auth.send}
                    </button>
                  )}
                </div>
              )}

              {!showForgot ? null : (
                <div
                  className={`${styles.signinLink} ${styles.footer}`}
                  onClick={() => {
                    setShowForgot(false);
                    setShowCheckEmail(false);
                  }}
                >
                  {i18n.auth.signin}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
