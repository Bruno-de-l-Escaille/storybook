import React, { useState, useEffect, useRef } from "react";
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
  initiateOTPLogin,
  selectAccount,
} from "./api";
import {
  validateEmail,
  validatePhone,
  processJWTToken,
} from "./utils";
import styles from "./GoPeopleAuthHeader.module.scss";

// Icônes SVG optimisées
const Icons = {
  Close: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.85888 7.99949L6.50533 7.64594L0.959195 2.09981C0.643914 1.78453 0.64395 1.2734 0.959169 0.958228L0.959195 0.958202C1.27446 0.642936 1.78553 0.642936 2.1008 0.958202L7.64701 6.50441L8.00056 6.85796L8.35412 6.50441L13.9003 0.958129C13.9003 0.958129 13.9003 0.958128 13.9003 0.958127C14.2156 0.642872 14.7266 0.642864 15.0419 0.958104C15.0419 0.958112 15.0419 0.958121 15.0419 0.958129M6.85888 7.99949L15.0419 0.958129M6.85888 7.99949L6.50533 8.35305M6.85888 7.99949L6.50533 8.35305M15.0419 0.958129C15.3571 1.27342 15.3571 1.78456 15.0419 2.09973M15.0419 0.958129L15.0419 2.09973M15.0419 2.09973C15.0419 2.09973 15.0419 2.09973 15.0419 2.09973M15.0419 2.09973L15.0419 2.09973M15.0419 2.09973L9.49572 7.64587M15.0419 2.09973L9.49572 7.64587M6.50533 8.35305L0.959195 13.8992C0.643929 14.2144 0.643929 14.7255 0.959195 15.0408C1.27447 15.3561 1.7856 15.356 2.10077 15.0408L2.1008 15.0408L7.64701 9.49458L8.00056 9.14103L8.35411 9.49458L13.9003 15.0408C14.2156 15.3561 14.7267 15.3561 15.0419 15.0408C15.3571 14.7256 15.3571 14.2145 15.0419 13.8992C15.0419 13.8992 15.0419 13.8992 15.0419 13.8992L9.49572 8.35297L9.14216 7.99942M6.50533 8.35305L9.14216 7.99942M9.14216 7.99942L9.49572 7.64587M9.14216 7.99942L9.49572 7.64587"
        fill="#E9FFDE"
        stroke="#E9FFDE"
      />
    </svg>
  ),
  Back: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Composant AccountCard
const AccountCard = ({ account, onSelect, isSelected, isLoading, index }) => {
  const [imageError, setImageError] = useState(false);
  const initials = `${account.firstname?.[0] || ''}${account.lastname?.[0] || ''}`.toUpperCase();

  return (
    <button
      className={`${styles.accountCard} ${isSelected ? styles.selected : ''}`}
      onClick={() => onSelect(account.user_id)}
      disabled={isLoading}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={styles.accountCardContent}>
        <div className={styles.accountAvatarContainer}>
          {account.avatar_url && !imageError ? (
            <img
              src={account.avatar_url}
              alt={`${account.firstname} ${account.lastname}`}
              className={styles.accountAvatar}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className={styles.accountAvatarFallback}>
              {initials}
            </div>
          )}
        </div>
        
        <div className={styles.accountDetails}>
          <h3 className={styles.accountName}>
            {account.firstname} {account.lastname}
          </h3>
          <p className={styles.accountEmail}>{account.email || account.phone}</p>
        </div>

        {isSelected && (
          <div className={styles.selectedBadge}>
            <Icons.Check />
          </div>
        )}
        
        <div className={styles.accountArrow}>
          <Icons.ChevronRight />
        </div>
      </div>
    </button>
  );
};

const GoPeopleAuthHeader = ({
  apiUrl = "http://local.api.tamtam.pro",
  apiBaseUrl = "http://localhost:8080",
  cookieUrl = "tamtam.pro",
  lng = "fr",
  onSuccess,
  onError,
  onClose,
  app = {},
  env = "dev",
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [step, setStep] = useState("IDENTIFIER");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState("");
  const [userId, setUserId] = useState("");
  
  const [accountsList, setAccountsList] = useState([]);
  const [selectionToken, setSelectionToken] = useState("");
  const [showAccountSelectionModal, setShowAccountSelectionModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    otp: "",
  });

  // Set the app element for react-modal accessibility
  useEffect(() => {
    // Try to find a suitable app element, fallback to body if not found
    const appElement =
      document.getElementById("root") ||
      document.getElementById("app") ||
      document.body;
    Modal.setAppElement(appElement);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowRegisterModal(false);
    setShowAccountSelectionModal(false);
    setStep("IDENTIFIER");
    setIdentifier("");
    setPassword("");
    setOtp("");
    setHasPassword(false);
    setAccountsList([]);
    setSelectionToken("");
    setSelectedAccountId(null);
    setErrors({ identifier: "", password: "", otp: "" });
    if (onClose) onClose();
  };

  const handleAuthTokenUser = (authData) => {
    try {
      if (authData.token || authData.jwt) {
        Toast.success(I18N[lng].auth.successfully_saved);
        handleAuthSuccess(authData);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error processing auth token:", error);
      Toast.error(I18N[lng].auth.error_occurred);
      if (onError) onError(error);
    }
  };

  const handleAuthSuccess = async (data) => {
    try {
      if (!data.jwt && !data.token) {
        throw new Error("No JWT token received from authentication");
      }

      const jwt = data.jwt || data.token;
      const { isJWTValid } = require("../../components/GoPeopleAuthHeader/utils");
      
      if (!isJWTValid(jwt)) {
        throw new Error("Invalid or expired JWT token");
      }

      const { extractAuthContextFromJWT } = require("./api");
      const authContext = extractAuthContextFromJWT(jwt);

      const baseAuthData = {
        token: authContext.ttpAccessToken,
        jwt: jwt,
        jwtToken: jwt,
        refreshToken: data.refresh_token,
        expiresIn: data.expiresIn || authContext.exp - Math.floor(Date.now() / 1000),
        createdAt: data.createdAt || Math.floor(Date.now() / 1000),
        scope: data.scope || "ttp",
        jti: data.jti || authContext.jti,
        exp: data.exp || authContext.exp,
        email: data.email || authContext.email,
        phone: data.phone || authContext.phone,
        id: data.id || authContext.ttpUserId,
        extra: data.extra || { lang: "fr", env },
      };

      let dtExpire = new Date();
      dtExpire.setTime(dtExpire.getTime() + baseAuthData.expiresIn * 1000);

      const { setCookie } = require("./utils");
      setCookie(`ttp_auth_${env}`, JSON.stringify(baseAuthData), dtExpire, "/");

      if (onSuccess) {
        onSuccess(baseAuthData);
      }
    } catch (error) {
      console.error("Error in auth success handler:", error);
      Toast.error(I18N[lng].auth.error_occurred);
      if (onError) onError(error);
    }
  };

  const validateIdentifier = (value) => {
    if (!value) return I18N[lng].auth.errors.validation.identifier_required;
    const isEmail = value.includes("@");
    return isEmail 
      ? (validateEmail(value) ? "" : I18N[lng].auth.errors.validation.email_format)
      : (validatePhone(value) ? "" : I18N[lng].auth.errors.validation.phone_format);
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
      const appName = app?.name || "tamtam";
      const response = await initiateAuth(apiBaseUrl, identifier, appName, lng);

      if (response.requires_account_selection) {
        setAccountsList(response.accounts || []);
        setSelectionToken(response.selection_token);
        setShowAccountSelectionModal(true);
        return;
      }

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

  const handleAccountConfirm = async () => {
    if (!selectedAccountId) {
      Toast.error("Veuillez sélectionner un compte");
      return;
    }

    setLoading(true);
    
    try {
      const response = await selectAccount(apiBaseUrl, selectionToken, selectedAccountId);
      
      if (response.token || response.jwt) {
        Toast.success(I18N[lng].auth.successfully_saved);
        handleAuthSuccess(response);
        setShowAccountSelectionModal(false);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error selecting account:", error);
      Toast.error(I18N[lng].auth.error_occurred || "Failed to select account");
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password) {
      setErrors({
        ...errors,
        password: I18N[lng].auth.errors.validation.password_required,
      });
      return;
    }

    setLoading(true);
    setErrors({ ...errors, password: "" });

    try {
      const response = await loginWithPassword(apiBaseUrl, identifier, password);

      if (response.requires_account_selection) {
        setAccountsList(response.accounts || []);
        setSelectionToken(response.selection_token);
        setShowAccountSelectionModal(true);
        return;
      }

      if (response.token || response.jwt) {
        Toast.success(I18N[lng].auth.successfully_saved);
        handleAuthSuccess(response);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error logging in with password:", error);
      
      let errorMessage = I18N[lng].auth.errors.authentication.invalid_credentials;
      if (error.message.includes("401")) errorMessage = I18N[lng].auth.errors.authentication.wrong_password;
      else if (error.message) errorMessage = error.message;

      setErrors({ ...errors, password: errorMessage });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWithoutPassword = async () => {
    setLoading(true);
    try {
      const appName = app?.name || "tamtam";
      const response = await initiateOTPLogin(apiBaseUrl, identifier, appName, lng);
      
      if (response.status === "OTP_SENT" || response.message) {
        setStep("OTP");
        Toast.info(I18N[lng].auth.reset_pwd_check_your_email);
      }
    } catch (error) {
      console.error("Error initiating OTP login:", error);
      Toast.error(error.message || I18N[lng].auth.error_occurred);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length < 6) {
      setErrors({
        ...errors,
        otp: I18N[lng].auth.errors.validation.otp_required,
      });
      return;
    }

    setLoading(true);
    setErrors({ ...errors, otp: "" });

    try {
      const response = await verifyOTP(apiBaseUrl, otp, identifier);

      if (response.requires_account_selection) {
        setAccountsList(response.accounts || []);
        setSelectionToken(response.selection_token);
        setShowAccountSelectionModal(true);
        return;
      }

      if (response.token) {
        const decodedToken = processJWTToken(response.token);
        const currentUserId = decodedToken.userInfo.userId;

        if (!currentUserId) throw new Error("User ID not found in token.");

        setClientToken(response.token);
        setUserId(currentUserId);

        if (response.isNewUser === true) {
          setShowModal(false);
          setShowRegisterModal(true);
        } else {
          Toast.success(I18N[lng].auth.successfully_saved);
          handleAuthSuccess(response);
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      
      let errorMessage = I18N[lng].auth.errors.otp.invalid;
      if (error.message.includes("400")) errorMessage = I18N[lng].auth.errors.otp.invalid;
      else if (error.message.includes("401")) errorMessage = I18N[lng].auth.errors.otp.expired;
      else if (error.message) errorMessage = error.message;

      setErrors({ ...errors, otp: errorMessage });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setErrors({ ...errors, password: "" });

    try {
      const appName = app?.name || "tamtam";
      const response = await requestPasswordReset(apiBaseUrl, identifier, appName, lng);

      if (response.status === "OTP_SENT" || response.message) {
        Toast.success(I18N[lng].auth.reset_pwd_check_your_email);
        setStep("RESET_OTP");
        setOtp("");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      Toast.error(error.message || I18N[lng].auth.error_occurred);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetOTPVerification = async () => {
    if (!otp || otp.length < 6) {
      setErrors({
        ...errors,
        otp: I18N[lng].auth.errors.validation.otp_required,
      });
      return;
    }

    setLoading(true);
    setErrors({ ...errors, otp: "" });

    try {
      const response = await verifyOTP(apiBaseUrl, otp, identifier);

      if (response.token || response.jwt) {
        Toast.success(I18N[lng].auth.password_changed_succesfully);
        handleAuthSuccess(response);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error verifying reset OTP:", error);
      
      let errorMessage = I18N[lng].auth.errors.otp.invalid;
      if (error.message.includes("400")) errorMessage = I18N[lng].auth.errors.otp.invalid;
      else if (error.message.includes("401")) errorMessage = I18N[lng].auth.errors.otp.expired;
      else if (error.message) errorMessage = error.message;

      setErrors({ ...errors, otp: errorMessage });
      Toast.error(errorMessage);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const AccountSelectionModal = () => (
  <Modal
    isOpen={showAccountSelectionModal}
    onRequestClose={() => setShowAccountSelectionModal(false)}
    shouldCloseOnOverlayClick={false}
    className={styles.modal}
    overlayClassName={styles.overlay}
  >
    <div className={styles.modalHeader}>
      {I18N[lng]?.auth?.selectAccount || "Choisissez votre compte"}
      <span className={styles.modalClose} onClick={() => setShowAccountSelectionModal(false)}>
        <Icons.Close />
      </span>
    </div>
    
    <div className={styles.container}>
      <p className={styles.selectionMessage}>
        {I18N[lng]?.auth?.multipleAccountsFound || 
          "Plusieurs comptes sont associés à cet identifiant. Choisissez celui avec lequel vous souhaitez vous connecter :"}
      </p>
      
      {accountsList.length > 0 ? (
        <>
          <div className={styles.accountsGrid}>
            {accountsList.map((account, index) => (
              <AccountCard
                key={account.user_id}
                account={account}
                onSelect={setSelectedAccountId}
                isSelected={selectedAccountId === account.user_id}
                isLoading={loading}
                index={index}
              />
            ))}
          </div>
          
          {loading && (
            <div className={styles.loadingOverlay}>
              <Loader color="#18a0fb" size="medium" />
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.button_secondary}
              onClick={() => setShowAccountSelectionModal(false)}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              className={`${styles.button} ${!selectedAccountId || loading ? styles.disabled : ''}`}
              onClick={handleAccountConfirm}
              disabled={!selectedAccountId || loading}
            >
              {loading ? <Loader color="#fff" size="small" /> : "Confirmer"}
            </button>
          </div>
        </>
      ) : (
        <div className={styles.emptyAccounts}>
          <p>Aucun compte trouvé</p>
        </div>
      )}
    </div>
  </Modal>
);

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

  const renderResetOTPStep = () => (
    <div className={styles.loginContent}>
      <h1 className={styles.title}>{I18N[lng].auth.enterResetCode}</h1>

      <p className={styles.otpMessage}>{I18N[lng].auth.resetCodeMessage}</p>

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
          <button className={styles.button} onClick={handleResetOTPVerification}>
            {I18N[lng].auth.verifyResetCode}
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
            <Icons.Close />
          </span>
        </div>

        <div className={styles.container}>
          {step === "IDENTIFIER" && renderIdentifierStep()}
          {step === "PASSWORD" && renderPasswordStep()}
          {step === "OTP" && renderOTPStep()}
          {step === "RESET_OTP" && renderResetOTPStep()}
        </div>
      </Modal>

      <AccountSelectionModal />

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