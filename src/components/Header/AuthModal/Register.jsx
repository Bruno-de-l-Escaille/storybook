import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import ReactCodeInput from "react-code-input";

import FormInput from "../../common/FormInput";
import Loader from "../../common/Loader";
import { Toast } from "../../ToastContainer/ToastContainer";
import AgreationNumber from "../../common/AgreationNumber";
import Checkbox from "../../common/Checkbox";

import {
  getClientCredential,
  postUserEmail,
  saveUser,
  postUserCredential,
  postValidateEmailCode,
} from "../../../api";
import {
  validateEmail,
  cleanEmail,
  validatePhone,
  validatePassword,
  formatPhone,
} from "./utils";
import { IconCheckCircle, SELECT_STYLES_LARGE } from "./consts";

import styles from "./AuthModal.module.scss";

const ErrorMsg = ({ msg }) => {
  return <div dangerouslySetInnerHTML={{ __html: msg }}></div>;
};

const Register = ({
  app,
  i18n,
  closeModal,
  showLogin,
  showLoginWithEmail,
  lng,
  clientToken,
  setClientToken,
  handleAuthTokenUser,
  showForgotResetPassword,
}) => {
  const AGREATION_OPTIONS = [
    { value: "NOTARIAL_OFFICE", label: i18n.auth.notarial_office },
    { value: "ITAA", label: i18n.auth.itaa },
    { value: "IRE_AUDIT", label: i18n.auth.ire_audit },
    { value: "LAW_OFFICE", label: i18n.auth.law_office },
    { value: "UNIVERSITY", label: i18n.auth.university },
    { value: "OTHER", label: i18n.auth.other },
  ];

  const LANGUAGE_OPTIONS = [
    { value: "fr", label: i18n.auth.french },
    { value: "nl", label: i18n.auth.dutch },
  ];

  const inputRef = useRef();

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [gender, setGender] = useState("");
  const [numeroAgreation, setNumeroAgreation] = useState("");
  const [agreation, setAgreation] = useState(AGREATION_OPTIONS[0]);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [isNewEmail, setIsNewEmail] = useState(true);
  const [step, setStep] = useState("step1");
  const [isAccepted, setIsAccepted] = useState(false);
  const [pwdProgressValue, setPwdProgressValue] = useState(0);
  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [acceptError, setAcceptError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [keyValidation, setKeyValidation] = useState("");
  const [showCodeError, setShowCodeError] = useState(false);
  const GENDER_OPTIONS = [
    { value: "MALE", label: i18n.auth.male },
    { value: "FEMALE", label: i18n.auth.female },
  ];

  useEffect(() => {
    if (!clientToken) {
      getClientCredential(
        app.apiUrl,
        app.clientCredential,
        app.authAppName ?? app.appName
      )
        .then((resp) => {
          const token = resp.data.token.access_token;
          setClientToken(token);
        })
        .catch((e) => {});
    }
  }, []);

  const handleBlurEmail = (e) => {
    if (!validateEmail(cleanEmail(email))) {
      setErrors({ ...errors, email: i18n.auth.validate_email });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handlePhoneBlur = (e) => {
    setPhone(formatPhone(phone));
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    setIsAccepted(!isAccepted);
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
    })
      .then((resp) => {
        setEmail(emailStr);
        setIsSaving(false);
        setStep("step2");
        // setShowCheckEmail(false);
      })
      .catch((e) => {
        setIsSaving(false);
        Toast.error(i18n.auth.invalid_code);
      });
  };

  const handleValidateEmail = () => {
    const emailStr = cleanEmail(email);
    if (!validateEmail(emailStr)) {
      setErrors({ ...errors, email: i18n.auth.validate_email });
      return null;
    }

    setIsSaving(true);
    postUserEmail(app.apiUrl, app.authAppName, clientToken, emailStr, lng)
      .then((resp) => {
        if (resp.data.data.success) {
          if (resp.data.data.data.status === "VALIDATED") {
            setEmail(resp.data.data.data.email);
            setStep("step2");
          } else {
            setShowCheckEmail(true);
            if (!resp.data.data.isNew) {
              setIsNewEmail(false);
            }
          }
        } else {
          if (resp.data.data.data) {
            if (resp.data.data.data.hasPwd) {
              Toast.info(i18n.auth.account_exist_login);
              showLoginWithEmail(emailStr);
            } else {
              Toast.info(i18n.auth.account_exist_pwd);
              showForgotResetPassword(emailStr);
            }
          }
        }
        setIsSaving(false);
      })
      .catch((e) => {
        setIsSaving(false);
      });
  };

  const handleKeyUp = (fieldName, fieldValue) => {
    let value = "";
    if (fieldValue.length === 0) {
      value = i18n.auth.required_field;
    } else {
      switch (fieldName) {
        case "phone":
          const result = validatePhone(fieldValue);
          if (!result.valid) {
            value = i18n.auth.validate_phone;
          }
          break;
        case "lastName":
        case "firstName":
          if (fieldValue.length < 2) {
            value = i18n.auth.required_2_characters;
          }
          break;
        case "password":
          var pwdResult = validatePassword(password, [
            email,
            firstName,
            lastName,
          ]);

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
        case "confirmPassword":
          if (fieldValue !== password) {
            value = i18n.auth.password_not_match;
          }
          break;
      }
    }
    setErrors({ ...errors, [fieldName]: value });
    return value;
  };

  const validate = () => {
    let tabErrors = {};
    tabErrors.lastName = handleKeyUp("lastName", lastName);
    tabErrors.firstName = handleKeyUp("firstName", firstName);
    tabErrors.phone = handleKeyUp("phone", phone);
    tabErrors.password = !hasPassword ? handleKeyUp("password", password) : "";
    tabErrors.confirmPassword = !hasPassword
      ? handleKeyUp("confirmPassword", confirmPassword)
      : "";

    setErrors(tabErrors);

    setAcceptError(!isAccepted);

    return tabErrors.lastName ||
      tabErrors.firstName ||
      tabErrors.phone ||
      tabErrors.password ||
      tabErrors.confirmPassword ||
      !isAccepted
      ? true
      : false;
  };

  const save = () => {
    let error = validate();
    if (error) {
      return null;
    }

    const data = {
      id,
      email,
      firstName,
      lastName,
      phone,
      language: language.value,
      gender: gender ? gender.value : "",
      password: password !== "**********" ? password : "",
      confirmPassword: confirmPassword !== "**********" ? confirmPassword : "",
      agreation: numeroAgreation
        ? JSON.stringify({
            type: agreation.value,
            number: numeroAgreation,
          })
        : "",
    };

    setIsSaving(true);
    saveUser(app.apiUrl, clientToken, data)
      .then((resp) => {
        postUserCredential(
          app.apiUrl,
          { email, password },
          app.clientCredential,
          app.authAppName ?? app.appName
        ).then((authResponse) => {
          handleAuthTokenUser(authResponse.data);
          // setIsSaving(false);
          // closeModal();
        });
      })
      .catch((e) => {
        if (
          e.response &&
          e.response.data &&
          e.response.data.errors &&
          e.response.data.errors.length > 0
        ) {
          Toast.error(e.response.data.errors[0].message);
        } else {
          Toast.error(i18n.auth.error);
        }

        setIsSaving(false);
      });
  };

  const changePassword = () => {
    setPassword("");
    setConfirmPassword("");
    setHasPassword(false);

    setTimeout(() => {
      inputRef.current.focus();
    });
  };

  return (
    <div>
      <div className={styles.modalHeader}>
        {i18n.auth.signup}
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
        <span onClick={showLogin} className={styles.topBar_link}>
          {i18n.auth.signin}
        </span>
      </div>
      <div className={styles.container}>
        {step === "step1" && (
          <div className={styles.loginContent}>
            <h1 className={styles.title}>{i18n.auth.signup}</h1>

            {showCheckEmail ? (
              <>
                <p className={styles.successMsg}>
                  <IconCheckCircle size="80" />
                  {isNewEmail ? (
                    <span>{i18n.auth.check_your_email}</span>
                  ) : (
                    <>
                      <span>{i18n.auth.already_sent_email}</span>
                      <span className={styles.successMsg_send}>
                        {i18n.auth.resend_confirmation_email}
                      </span>
                    </>
                  )}
                </p>
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
                    <span className={styles.error}>
                      Veuillez saisir le code
                    </span>
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
                    <button
                      className={styles.button}
                      onClick={validateEmailCode}
                    >
                      {i18n.auth.send}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <FormInput
                  name="email"
                  value={email}
                  label={i18n.auth.email}
                  error={errors.email}
                  className="sb-ttp-input-lg"
                  labelClassName="sb-ttp-label-lg"
                  // autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => handleBlurEmail(e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleValidateEmail();
                    }
                  }}
                />

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
                      onClick={handleValidateEmail}
                    >
                      {i18n.auth.continue}
                    </button>
                  )}
                </div>
              </>
            )}
            <p className={styles.helpText}>
              Si vous détenez un compte TamTam, veuillez utiliser votre adresse.
            </p>
          </div>
        )}

        {step === "step2" && (
          <>
            <div className={styles.contentLg}>
              <h1 className={styles.title}>
                {step === "step1"
                  ? i18n.auth.signup
                  : i18n.auth.complete_personal_infos}
              </h1>

              <div className={styles.contentLg_grid}>
                <div className={styles.contentLg_left}>
                  <div className={styles.emailInputBox}>
                    <FormInput
                      name="email"
                      value={email}
                      label={i18n.auth.email_address}
                      disabled={true}
                      autocomplete="username"
                      hideLockIcon={true}
                      className={`${styles.emailInput} sb-ttp-input-lg`}
                      labelClassName="sb-ttp-label-lg"
                    />
                    <IconCheckCircle />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.cell}>
                      <FormInput
                        name="lastName"
                        required={true}
                        label={i18n.auth.lastname}
                        autoComplete="off"
                        error={errors.lastName}
                        value={lastName}
                        className="sb-ttp-input-lg"
                        labelClassName="sb-ttp-label-lg"
                        onKeyUp={(e) =>
                          handleKeyUp(e.target.name, e.target.value)
                        }
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className={styles.cell}>
                      <FormInput
                        name="firstName"
                        required={true}
                        label={i18n.auth.firstname}
                        autoComplete="off"
                        error={errors.firstName}
                        value={firstName}
                        className="sb-ttp-input-lg"
                        labelClassName="sb-ttp-label-lg"
                        onKeyUp={(e) =>
                          handleKeyUp(e.target.name, e.target.value)
                        }
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.btnChangePwd}>
                    {hasPassword && (
                      <span onClick={changePassword}>
                        {i18n.auth.change_password}
                      </span>
                    )}
                    <div className={styles.passwordBox}>
                      <FormInput
                        inputRef={inputRef}
                        name="password"
                        value={password}
                        label={i18n.auth.password}
                        type="password"
                        required={true}
                        autoComplete="off"
                        error={errors.password}
                        disabled={hasPassword}
                        className="sb-ttp-input-lg"
                        labelClassName="sb-ttp-label-lg"
                        onKeyUp={(e) =>
                          handleKeyUp(e.target.name, e.target.value)
                        }
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {password && !hasPassword && (
                      <progress
                        className={`${
                          pwdProgressValue > 30 ? "success" : "alert"
                        } ${styles.progress}`}
                        max="100"
                        value={pwdProgressValue}
                      ></progress>
                    )}
                  </div>

                  <FormInput
                    name="confirmPassword"
                    value={confirmPassword}
                    label={i18n.auth.confirm_password}
                    type="password"
                    required={true}
                    autocomplete="new-password"
                    disabled={hasPassword}
                    className="sb-ttp-input-lg"
                    labelClassName="sb-ttp-label-lg"
                    error={errors.confirmPassword}
                    onKeyUp={(e) => handleKeyUp(e.target.name, e.target.value)}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className={styles.contentLg_right}>
                  <FormInput
                    name="phone"
                    required={true}
                    label={i18n.auth.mobile_phone_number}
                    placeholder="+32XXXXXXXX"
                    autoComplete="off"
                    value={phone}
                    error={errors.phone}
                    className="sb-ttp-input-lg"
                    labelClassName="sb-ttp-label-lg"
                    onKeyUp={(e) => handleKeyUp(e.target.name, e.target.value)}
                    onChange={(e) => setPhone(e.target.value)}
                    handleBlur={(e) => handlePhoneBlur(e)}
                  />

                  <div className={styles.row}>
                    <div className={styles.cell}>
                      <div className="sb-ttp-form-group-h">
                        <label className="sb-ttp-label sb-ttp-label-lg">
                          {i18n.auth.gender}
                        </label>
                        <Select
                          styles={SELECT_STYLES_LARGE}
                          options={GENDER_OPTIONS}
                          isSearchable={false}
                          isClearable={true}
                          value={gender}
                          onChange={(e) => setGender(e)}
                        />
                      </div>
                    </div>
                    <div className={styles.cell}>
                      <div className="sb-ttp-form-group-h">
                        <label className="sb-ttp-label sb-ttp-label-lg">
                          {i18n.auth.language}
                        </label>
                        <Select
                          styles={SELECT_STYLES_LARGE}
                          options={LANGUAGE_OPTIONS}
                          isSearchable={false}
                          value={language}
                          onChange={(e) => setLanguage(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sb-ttp-form-group-h">
                    <label className="sb-ttp-label sb-ttp-label-lg">
                      {i18n.auth.numeroAgreation}
                    </label>

                    <AgreationNumber
                      NumeroAgreation={numeroAgreation}
                      Agreation={agreation}
                      setAgreation={(value) => setAgreation(value)}
                      setNumeroAgreation={(value) => setNumeroAgreation(value)}
                      // small={true}
                      showNumberLabel={true}
                      i18n={i18n}
                      AGREATION_OPTIONS={AGREATION_OPTIONS}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div>
                <div className={styles.acceptActions}>
                  <Checkbox
                    checked={isAccepted}
                    onClick={handleCheckboxClick}
                  />
                  <label
                    className={styles.checkbox}
                    onClick={handleCheckboxClick}
                  >
                    <span>
                      {i18n.auth.create_account_ok}
                      <a
                        target="_blank"
                        href={`https://help.tamtam.pro/${lng}/privacy?type=terms_of_use`}
                        className="text-button-1"
                      >
                        {i18n.auth.term_of_use}
                      </a>
                    </span>
                  </label>
                </div>
                {acceptError && (
                  <p className={styles.acceptError}>
                    {i18n.auth.must_accept_conditions}
                  </p>
                )}
              </div>

              <div>
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
                  <button className={styles.button} onClick={save}>
                    {i18n.auth.create_account}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
