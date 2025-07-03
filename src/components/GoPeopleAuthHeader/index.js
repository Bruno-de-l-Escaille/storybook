import React, { useState } from "react";
import Modal from "react-modal";
import ReactCodeInput from "react-code-input";

import { FlashMessage } from "../ToastContainer/ToastContainer";
import { I18N } from "../../i18n";
import FormInput from "../common/FormInput";
import Loader from "../common/Loader";
import { Toast } from "../ToastContainer/ToastContainer";
import {
  initiateAuth,
  loginWithPassword,
  verifyOTP,
  requestPasswordReset,
} from "./api";
import { validateEmail, validatePhone, processJWTToken } from "./utils";
import styles from "./GoPeopleAuthHeader.module.scss";

const GoPeopleAuthHeader = ({
  apiBaseUrl = "http://localhost:8080",
  lng = "fr",
  onSuccess,
  onError,
  onClose,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState("IDENTIFIER"); // IDENTIFIER | PASSWORD | OTP
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    otp: "",
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setStep("IDENTIFIER");
    setIdentifier("");
    setPassword("");
    setOtp("");
    setHasPassword(false);
    setErrors({});
    if (onClose) onClose();
  };

  const handleAuthSuccess = (token) => {
    try {
      const tokenData = processJWTToken(token);

      if (onSuccess) {
        onSuccess(tokenData);
      }
    } catch (error) {
      console.error("Error processing JWT token:", error);
      Toast.error(I18N[lng].auth.error_occurred);
      if (onError) {
        onError(new Error(`JWT processing failed: ${error.message}`));
      }
    }
  };

  const validateIdentifier = (value) => {
    if (!value) {
      return I18N[lng].auth.required_field;
    }

    const isEmail = value.includes("@");
    if (isEmail) {
      return validateEmail(value) ? "" : I18N[lng].auth.validate_email;
    } else {
      return validatePhone(value) ? "" : I18N[lng].auth.validate_phone;
    }
  };

  const handleIdentifierSubmit = async () => {
    const identifierError = validateIdentifier(identifier);
    if (identifierError) {
      setErrors({ ...errors, identifier: identifierError });
      return;
    }

    setLoading(true);
    setErrors({ ...errors, identifier: "" });

    try {
      const response = await initiateAuth(apiBaseUrl, identifier);

      if (response.message === "Account exists with password") {
        setHasPassword(true);
        setStep("PASSWORD");
      } else if (response.status === "OTP_SENT") {
        setHasPassword(false);
        setStep("OTP");
      }
    } catch (error) {
      console.error("Error initiating auth:", error);
      Toast.error(error.message || I18N[lng].auth.error_occurred);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password) {
      setErrors({ ...errors, password: I18N[lng].auth.validate_password });
      return;
    }

    setLoading(true);
    setErrors({ ...errors, password: "" });

    try {
      const response = await loginWithPassword(
        apiBaseUrl,
        identifier,
        password
      );

      if (response.token) {
        Toast.success(I18N[lng].auth.successfully_saved);
        handleAuthSuccess(response.token);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error logging in with password:", error);
      setErrors({
        ...errors,
        password: error.message || I18N[lng].auth.invalid_credentials,
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithoutPassword = async () => {
    setLoading(true);

    try {
      const response = await requestPasswordReset(apiBaseUrl, identifier);

      if (response.message) {
        setStep("OTP");
        Toast.info(I18N[lng].auth.reset_pwd_check_your_email);
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      Toast.error(error.message || I18N[lng].auth.error_occurred);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length < 6) {
      setErrors({ ...errors, otp: I18N[lng].auth.invalid_code });
      return;
    }

    setLoading(true);
    setErrors({ ...errors, otp: "" });

    try {
      const response = await verifyOTP(apiBaseUrl, otp);

      if (response.token) {
        Toast.success(I18N[lng].auth.successfully_saved);
        handleAuthSuccess(response.token);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({
        ...errors,
        otp: error.message || I18N[lng].auth.invalid_code,
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderIdentifierStep = () => (
    <div className={styles.loginContent}>
      <h1 className={styles.title}>{I18N[lng].auth.authenticate}</h1>

      <FormInput
        name="identifier"
        value={identifier}
        label={I18N[lng].auth.enterEmailOrPhone}
        error={errors.identifier}
        className="sb-ttp-input-lg"
        labelClassName="sb-ttp-label-lg"
        onChange={(e) => setIdentifier(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleIdentifierSubmit();
          }
        }}
      />

      <div className={styles.actions}>
        {loading ? (
          <button className={styles.button}>
            <Loader style={{ height: "10px" }} color={"#fff"} />
          </button>
        ) : (
          <button className={styles.button} onClick={handleIdentifierSubmit}>
            {I18N[lng].auth.continue}
          </button>
        )}
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div className={styles.loginContent}>
      <h1 className={styles.title}>{I18N[lng].auth.signin}</h1>

      <FormInput
        name="identifier"
        value={identifier}
        label={I18N[lng].auth.email_address}
        disabled={true}
        className="sb-ttp-input-lg"
        labelClassName="sb-ttp-label-lg"
      />

      <FormInput
        name="password"
        value={password}
        label={I18N[lng].auth.password}
        type="password"
        error={errors.password}
        className="sb-ttp-input-lg"
        labelClassName="sb-ttp-label-lg"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handlePasswordLogin();
          }
        }}
      />

      <div className={styles.actions}>
        {loading ? (
          <button className={styles.button}>
            <Loader style={{ height: "10px" }} color={"#fff"} />
          </button>
        ) : (
          <button className={styles.button} onClick={handlePasswordLogin}>
            {I18N[lng].auth.signin}
          </button>
        )}
      </div>

      <div className={styles.forgotPasswordLink}>
        <span
          className={styles.linkText}
          onClick={handleContinueWithoutPassword}
        >
          {I18N[lng].auth.continueWithoutPassword}
        </span>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className={styles.loginContent}>
      <h1 className={styles.title}>{I18N[lng].auth.enterOTP}</h1>

      <p className={styles.otpMessage}>{I18N[lng].auth.otpSentMessage}</p>

      <div className={styles.codeBox}>
        <ReactCodeInput
          type="number"
          fields={6}
          value={otp}
          onChange={(value) => setOtp(value)}
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
          autoFocus={true}
        />
        {errors.otp && <span className={styles.error}>{errors.otp}</span>}
      </div>

      <div className={styles.actions}>
        {loading ? (
          <button className={styles.button}>
            <Loader style={{ height: "10px" }} color={"#fff"} />
          </button>
        ) : (
          <button className={styles.button} onClick={handleOTPVerification}>
            {I18N[lng].auth.verifyOTP}
          </button>
        )}
      </div>
    </div>
  );

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
        <div className={styles.modalHeader}>
          {I18N[lng].auth.signInUp}
          <span className={styles.modalClose} onClick={handleCloseModal}>
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

        <div className={styles.container}>
          {step === "IDENTIFIER" && renderIdentifierStep()}
          {step === "PASSWORD" && renderPasswordStep()}
          {step === "OTP" && renderOTPStep()}
        </div>
      </Modal>
    </>
  );
};

export { GoPeopleAuthHeader };
