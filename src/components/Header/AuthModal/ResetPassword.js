import React, { useState } from "react";
import classNames from "classnames";

import FormInput from "../../common/FormInput";
import Loader from "../../common/Loader";
import {
  postUserCredential,
  changePassword,
  getTokenWithoutPassword,
} from "../../../api";
import { Toast } from "../../ToastContainer/ToastContainer";
import { validatePassword } from "./utils";
import { IconCheckCircle } from "./consts";

import styles from "./AuthModal.module.scss";

const ResetPassword = ({
  app,
  i18n,
  closeModal,
  showLogin,
  clientToken,
  handleAuthTokenUser,
  email,
  emailKey,
}) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [pwdProgressValue, setPwdProgressValue] = useState(0);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingWithout, setIsSavingWithout] = useState(false);

  const handleTokenWithoutPassword = () => {
    setIsSavingWithout(true);
    getTokenWithoutPassword({
      apiUrl: app.apiUrl,
      token: clientToken,
      key: emailKey,
    })
      .then((resp) => {
        handleAuthTokenUser(resp.data.data);
        // closeModal();
      })
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.errors) {
          e.response.data.errors.length > 0
            ? Toast.error(e.response.data.errors[0].message)
            : e.response.data.errors.message
            ? Toast.error(e.response.data.errors.message)
            : e.response?.status >= 500
            ? Toast.error(i18n.auth.server_error)
            : Toast.error(i18n.auth.error_try_again);
        } else {
          if (e?.response?.status === 502 || e?.response?.status === 503) {
            Toast.error(i18n.auth.server_error);
          } else if (e?.response?.status >= 500 && e?.response?.data?.detail) {
            Toast.error(e.response.data.detail);
          } else {
            Toast.error(i18n.auth.error_try_again);
          }
        }
        setIsSavingWithout(false);
      });
  };

  const handleResetPassword = () => {
    setIsSaving(true);
    changePassword({
      apiUrl: app.apiUrl,
      token: clientToken,
      key: emailKey,
      password,
      passwordConfirm,
    })
      .then((resp) => {
        Toast.success(i18n.auth.password_changed_succesfully);
        postUserCredential(
          app.apiUrl,
          { email, password },
          app.clientCredential
        ).then((authResponse) => {
          handleAuthTokenUser(authResponse.data);
          // closeModal();
        });
      })
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.errors) {
          e.response.data.errors.length > 0
            ? Toast.error(e.response.data.errors[0].message)
            : e.response.data.errors.message
            ? Toast.error(e.response.data.errors.message)
            : e.response?.status >= 500
            ? Toast.error(i18n.auth.server_error)
            : Toast.error(i18n.auth.error_try_again);
        } else {
          if (e?.response?.status === 502 || e?.response?.status === 503) {
            Toast.error(i18n.auth.server_error);
          } else if (e?.response?.status >= 500 && e?.response?.data?.detail) {
            Toast.error(e.response.data.detail);
          } else {
            Toast.error(i18n.auth.error_try_again);
          }
        }
        setIsSaving(false);
      });
  };

  const handleKeyUp = (fieldName, fieldValue) => {
    let value = "";
    if (fieldValue.length === 0) {
      value = i18n.auth.required_field;
    } else {
      switch (fieldName) {
        case "password":
          var pwdResult = validatePassword(password, [email]);
          if (pwdResult.strength > 30) {
            setPwdProgressValue(pwdResult.strength);
          } else {
            value = i18n.auth.password_weak;
            if (pwdResult.strength < 4) {
              setPwdProgressValue(pwdResult.strength + 25);
            } else {
              setPwdProgressValue(pwdResult.strength - 0.01);
            }
          }
          break;
        case "passwordConfirm":
          if (fieldValue !== password) {
            value = i18n.auth.password_not_match;
          }
          break;
        default:
      }
    }
    setErrors({ ...errors, [fieldName]: value });
    return value;
  };

  const formIsValid = () => {
    return (
      password.length > 0 &&
      errors.password === "" &&
      passwordConfirm.length > 0 &&
      errors.passwordConfirm === ""
    );
  };

  return (
    <div>
      <div className={styles.modalHeader}>
        {i18n.auth.reset_password}
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
      <div className={styles.topBar}>
        <span>{i18n.auth.already_member}</span>
        <span
          onClick={() => {
            showLogin();
            // router.push("/" + lng);
          }}
          className={styles.topBar_link}
        >
          {i18n.auth.signin}
        </span>
      </div>
      <div className={styles.container}>
        <div className={styles.loginContent}>
          <h1 className={styles.title}>{i18n.auth.reset_password}</h1>
          <div className={styles.emailInputBox}>
            <FormInput
              name="email"
              value={email}
              label={i18n.auth.email_address}
              disabled={true}
              className={`${styles.emailInput} sb-ttp-input-lg`}
              labelClassName="sb-ttp-label-lg"
            />
            <IconCheckCircle />
          </div>

          <div className={styles.passwordBox}>
            <FormInput
              name="password"
              value={password}
              label={i18n.auth.password}
              type="password"
              required={true}
              autocomplete="new-password"
              className="sb-ttp-input-lg"
              labelClassName="sb-ttp-label-lg"
              error={errors.password}
              onKeyUp={(e) => handleKeyUp(e.target.name, e.target.value)}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <progress
                className={`${pwdProgressValue > 30 ? "success" : "alert"} ${
                  styles.progress
                }`}
                max="100"
                value={pwdProgressValue}
              ></progress>
            )}
          </div>
          <FormInput
            name="passwordConfirm"
            value={passwordConfirm}
            label={i18n.auth.confirm_password}
            type="password"
            required={true}
            autoComplete="off"
            className="sb-ttp-input-lg"
            labelClassName="sb-ttp-label-lg"
            error={errors.passwordConfirm}
            onKeyUp={(e) => handleKeyUp(e.target.name, e.target.value)}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

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
                  styles.button,
                  (password.length === 0 || password !== passwordConfirm) &&
                    styles.button_disabled
                )}
                disabled={!formIsValid()}
                onClick={handleResetPassword}
              >
                {i18n.auth.reset_password}
              </button>
            )}

            {isSavingWithout ? (
              <button
                className={classNames(styles.button, styles.button_secondary)}
              >
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
                  styles.button,
                  styles.button_secondary,
                  (password.length === 0 || password !== passwordConfirm) &&
                    styles.button_disabled
                )}
                onClick={handleTokenWithoutPassword}
              >
                {i18n.auth.login_without_password}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
