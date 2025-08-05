import React, { useState } from "react";
import Modal from "react-modal";
import ReactCodeInput from "react-code-input";

import { FlashMessage } from "../ToastContainer/ToastContainer";
import { I18N } from "../../i18n";
import FormInput from "../common/FormInput";
import Loader from "../common/Loader";
import { Toast } from "../ToastContainer/ToastContainer";
import GoPeopleRegistrationModal from "./GoPeopleRegistrationModal";
import {
  initiateAuth,
  loginWithPassword,
  verifyOTP,
  requestPasswordReset,
} from "./api";
import {
  validateEmail,
  validatePhone,
  processJWTToken,
  normalizeAuthData,
} from "./utils";
import styles from "./GoPeopleAuthHeader.module.scss";

const GoPeopleAuthHeader = ({
  apiBaseUrl = "http://localhost:8080",
  lng = "fr",
  onSuccess,
  onError,
  onClose,
  app = {},
  env = "dev",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [step, setStep] = useState("IDENTIFIER"); // IDENTIFIER | PASSWORD | OTP | REGISTER
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [userId, setUserId] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    otp: "",
  });

  const handleCloseModal = () => {
    setShowModal(false);
    setShowRegisterModal(false);
    setStep("IDENTIFIER");
    setIdentifier("");
    setPassword("");
    setOtp("");
    setHasPassword(false);
    setErrors({});
    if (onClose) onClose();
  };

  const handleAuthTokenUser = (authData) => {
    try {
      if (authData.token) {
        Toast.success(I18N[lng].auth.successfully_saved);
        handleAuthSuccess(authData.token);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error processing auth token:", error);
      Toast.error(I18N[lng].auth.error_occurred);
      if (onError) onError(error);
    }
  };

  const handleAuthSuccess = (token) => {
    try {
      const processedData = processJWTToken(token);
      const normalizedData = normalizeAuthData(processedData, env, app);
      if (onSuccess) {
        onSuccess({ ...normalizedData, jwt: token });
      }
    } catch (error) {
      console.error("Error processing token:", error);
      Toast.error(I18N[lng].auth.error_occurred);
      if (onError) {
        onError(new Error(`Token processing failed: ${error.message}`));
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

      // Handle specific 409 conflicts for phone/email during auth initiation
      const conflictErrorMessage = error.message || "";
      const isConflictError =
        error.message.includes("409") ||
        conflictErrorMessage.includes("409") ||
        conflictErrorMessage.toLowerCase().includes("already exists") ||
        conflictErrorMessage.toLowerCase().includes("conflict");

      if (isConflictError) {
        if (conflictErrorMessage.toLowerCase().includes("phone")) {
          setErrors({
            ...errors,
            identifier:
              I18N[lng].auth.phone_already_exists ||
              "This phone number is already registered",
          });
          Toast.error(
            I18N[lng].auth.phone_conflict ||
              "Phone number already exists. Please use a different phone number."
          );
        } else if (conflictErrorMessage.toLowerCase().includes("email")) {
          setErrors({
            ...errors,
            identifier:
              I18N[lng].auth.email_already_exists ||
              "This email address is already registered",
          });
          Toast.error(
            I18N[lng].auth.email_conflict ||
              "Email address already exists. Please use a different email address."
          );
        } else {
          // Show the actual error message from the server
          Toast.error(conflictErrorMessage || "User already exists");
          console.log("409 Conflict Error Details:", error);
        }
        if (onError) onError(error);
        return;
      }

      // Provide more specific error messages
      let errorMessage = I18N[lng].auth.error_occurred || "An error occurred";

      if (error.message.includes("400")) {
        errorMessage =
          I18N[lng].auth.invalid_email || "Invalid email or phone number";
      } else if (error.message.includes("404")) {
        errorMessage = I18N[lng].auth.user_not_found || "User not found";
      } else if (error.message.includes("500")) {
        errorMessage = I18N[lng].auth.server_error || "Server error occurred";
      } else if (
        error.message.toLowerCase().includes("network") ||
        error.message.toLowerCase().includes("fetch")
      ) {
        errorMessage =
          I18N[lng].auth.network_error || "Network connection failed";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.error(errorMessage);
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

      // Provide more specific error messages for password login
      let errorMessage =
        I18N[lng].auth.invalid_credentials || "Invalid credentials";

      if (error.message.includes("401")) {
        errorMessage = I18N[lng].auth.wrong_password || "Incorrect password";
      } else if (error.message.includes("403")) {
        errorMessage = I18N[lng].auth.account_locked || "Account is locked";
      } else if (error.message.includes("429")) {
        errorMessage =
          I18N[lng].auth.too_many_attempts ||
          "Too many login attempts. Please try again later";
      } else if (error.message.includes("500")) {
        errorMessage = I18N[lng].auth.server_error || "Server error occurred";
      } else if (
        error.message.toLowerCase().includes("network") ||
        error.message.toLowerCase().includes("fetch")
      ) {
        errorMessage =
          I18N[lng].auth.network_error || "Network connection failed";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({
        ...errors,
        password: errorMessage,
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

      // Provide more specific error messages
      let errorMessage = I18N[lng].auth.error_occurred || "An error occurred";

      if (error.message.includes("400")) {
        errorMessage = I18N[lng].auth.invalid_email || "Invalid email address";
      } else if (error.message.includes("404")) {
        errorMessage = I18N[lng].auth.user_not_found || "User not found";
      } else if (error.message.includes("429")) {
        errorMessage =
          I18N[lng].auth.too_many_requests ||
          "Too many requests. Please try again later";
      } else if (error.message.includes("500")) {
        errorMessage = I18N[lng].auth.server_error || "Server error occurred";
      } else if (
        error.message.toLowerCase().includes("network") ||
        error.message.toLowerCase().includes("fetch")
      ) {
        errorMessage =
          I18N[lng].auth.network_error || "Network connection failed";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.error(errorMessage);
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
        // Decode the token to get the user ID
        const decodedToken = processJWTToken(response.token);
        const currentUserId = decodedToken.userInfo.userId;

        if (!currentUserId) {
          throw new Error("User ID not found in token.");
        }

        // Store the token and user ID
        setClientToken(response.token);
        setUserId(currentUserId);

        if (!hasPassword) {
          // New user path - needs to complete registration
          setShowModal(false);
          setShowRegisterModal(true);
        } else {
          // Existing user path - complete authentication
          Toast.success(I18N[lng].auth.successfully_saved);
          handleAuthSuccess(response.token);
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      // Provide more specific error messages for OTP verification
      let errorMessage =
        I18N[lng].auth.invalid_code || "Invalid verification code";

      if (error.message.includes("400")) {
        errorMessage =
          I18N[lng].auth.invalid_otp || "Invalid verification code";
      } else if (error.message.includes("401")) {
        errorMessage =
          I18N[lng].auth.expired_otp || "Verification code has expired";
      } else if (error.message.includes("429")) {
        errorMessage =
          I18N[lng].auth.too_many_attempts ||
          "Too many attempts. Please try again later";
      } else if (error.message.includes("500")) {
        errorMessage = I18N[lng].auth.server_error || "Server error occurred";
      } else if (
        error.message.toLowerCase().includes("network") ||
        error.message.toLowerCase().includes("fetch")
      ) {
        errorMessage =
          I18N[lng].auth.network_error || "Network connection failed";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({
        ...errors,
        otp: errorMessage,
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
      <div className={styles.titleContainer}>
        <span
          className={styles.backButton}
          onClick={() => setStep("IDENTIFIER")}
        >
          <svg
            width="35"
            height="19"
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38 12H10       
              M10 12L16 6      
              M10 12L16 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1 className={styles.title} onClick={() => setStep("IDENTIFIER")}>
          {I18N[lng].auth.modifyIdentifier}
        </h1>
      </div>

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
        type={isPasswordVisible ? "text" : "password"}
        error={errors.password}
        className="sb-ttp-input-lg"
        labelClassName="sb-ttp-label-lg"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handlePasswordLogin();
          }
        }}
        rightIcon={
          <span
            className={styles.passwordToggle}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {!isPasswordVisible ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2L22 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.71277 6.7226C3.66477 8.0226 1.63277 10.7126 1.00277 12.0026C2.73277 16.3926 7.00277 19.5026 12.0028 19.5026C14.1328 19.5026 16.1228 18.9826 17.8928 18.0726"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0019 14.9999C10.345 14.9999 9.00195 13.6568 9.00195 11.9999C9.00195 11.4399 9.16195 10.9299 9.42195 10.4999"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.5723 9.42716C15.9623 10.2172 16.9923 11.5672 16.9923 12.0022C16.9323 12.1822 16.8223 12.3822 16.7023 12.5822"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.2678 14.8816C21.9378 13.8216 22.5478 12.7116 22.9978 12.0016C21.2678 7.61164 16.9978 4.50164 11.9978 4.50164C10.9278 4.50164 9.89778 4.64164 8.94778 4.90164"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        }
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

      {/* Registration Modal for new users */}
      <Modal
        isOpen={showRegisterModal}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <GoPeopleRegistrationModal
          app={app}
          i18n={I18N[lng]}
          closeModal={handleCloseModal}
          lng={lng}
          clientToken={clientToken}
          setClientToken={setClientToken}
          handleAuthTokenUser={handleAuthTokenUser}
          email={identifier}
          apiBaseUrl={apiBaseUrl}
          userId={userId}
        />
      </Modal>
    </>
  );
};

export default GoPeopleAuthHeader;
