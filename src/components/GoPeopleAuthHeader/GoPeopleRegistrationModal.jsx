import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";

import FormInput from "../common/FormInput";
import Loader from "../common/Loader";
import { Toast } from "../ToastContainer/ToastContainer";
import AgreationNumber from "../common/AgreationNumber";
import Checkbox from "../common/Checkbox";

import {
  updateUser,
  setUserPassword,
  authenticateUser,
  syncUserCreation,
} from "./api";
import {
  validatePhone,
  validatePassword,
  formatPhone,
} from "../Header/AuthModal/utils";
import { processJWTToken } from "./utils";
import {
  IconCheckCircle,
  SELECT_STYLES_LARGE,
} from "../Header/AuthModal/consts";

import styles from "../Header/AuthModal/AuthModal.module.scss";

const GoPeopleRegistrationModal = ({
  app,
  i18n,
  closeModal,
  lng,
  clientToken,
  setClientToken,
  handleAuthTokenUser,
  email, // Pre-populated from OTP verification
  apiBaseUrl = "http://localhost:8080",
  userId,
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

  const GENDER_OPTIONS = [
    { value: "MALE", label: i18n.auth.male },
    { value: "FEMALE", label: i18n.auth.female },
  ];

  const inputRef = useRef();

  const [id] = useState("");
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
  const [isAccepted, setIsAccepted] = useState(false);
  const [pwdProgressValue, setPwdProgressValue] = useState(0);
  const [pwdRules, setPwdRules] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    hasSpecial: false,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [acceptError, setAcceptError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // No client credentials needed for GoPeople API
  useEffect(() => {
    // Client token should be passed from the OTP verification response
    // No need to fetch client credentials for GoPeople
  }, []);

  const handlePhoneBlur = (e) => {
    setPhone(formatPhone(phone));
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    setIsAccepted(!isAccepted);
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
          const rules = {
            minLength: fieldValue.length >= 8,
            hasUppercase: /[A-Z]/.test(fieldValue),
            hasLowercase: /[a-z]/.test(fieldValue),
            hasDigit: /[0-9]/.test(fieldValue),
            hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/]/.test(fieldValue),
          };
          setPwdRules(rules);

          const allRulesMet = Object.values(rules).every(Boolean);
          if (!allRulesMet) {
            value = i18n.auth.password_weak;
            setPwdProgressValue(
              Object.values(rules).filter(Boolean).length * 20
            );
            break;
          }

          var pwdResult = validatePassword(fieldValue, [
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

  const save = async () => {
    let error = validate();
    if (error) {
      return null;
    }

    const userData = {
      email,
      firstName,
      lastName,
      phone,
      language: language.value,
      gender: gender ? gender.value : "",
      agreation: numeroAgreation
        ? {
            type: agreation.value,
            number: numeroAgreation,
          }
        : null,
    };

    setIsSaving(true);

    try {
      if (!userId) {
        throw new Error("User ID is missing.");
      }

      // Step 1: Update the user's profile data
      await updateUser(app.apiUrl || apiBaseUrl, clientToken, userId, userData);

      // Step 2: Set the password for the newly completed profile
      if (password && password !== "**********") {
        await setUserPassword(app.apiUrl || apiBaseUrl, clientToken, password);
      }

      // Step 3: Authenticate the user with their new credentials to get a fresh token
      const authResponse = await authenticateUser(
        app.apiUrl || apiBaseUrl,
        email,
        password
      );

      // Step 4: Sync user creation after successful registration
      try {
        const syncResponse = await syncUserCreation(
          app.apiUrl || apiBaseUrl,
          authResponse.token,
          userId
        );

        if (syncResponse && syncResponse.token) {
          // Replace the token with the new one from the sync endpoint
          authResponse.token = syncResponse.token;
        }
      } catch (syncError) {
        console.warn("User sync warning:", syncError);
        // Don't fail the registration if sync fails, just log the warning
        // The user registration was successful, sync is just a secondary step
      }

      // Handle successful authentication
      handleAuthTokenUser(authResponse);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific 409 conflicts for phone/email
      const conflictErrorMessage = error.message || "";
      const isConflictError =
        error.message.includes("409") ||
        conflictErrorMessage.includes("409") ||
        conflictErrorMessage.toLowerCase().includes("already exists") ||
        conflictErrorMessage.toLowerCase().includes("conflict");

      if (isConflictError) {
        // Parse the conflict error to determine which field is conflicting
        if (conflictErrorMessage.toLowerCase().includes("phone")) {
          setErrors({
            ...errors,
            phone:
              i18n.auth.phone_already_exists ||
              "This phone number is already registered",
          });
          Toast.error(
            i18n.auth.phone_conflict ||
              "Phone number already exists. Please use a different phone number."
          );
        } else if (conflictErrorMessage.toLowerCase().includes("email")) {
          Toast.error(
            i18n.auth.email_conflict ||
              "Email address already exists. Please use a different email address."
          );
        } else {
          // Show the actual error message from the server
          Toast.error(conflictErrorMessage || "User already exists");
          console.log("409 Conflict Error Details:", error);
        }
        setIsSaving(false);
        return;
      }

      // Provide more specific error messages based on the error type
      let errorMessage =
        i18n.auth.error || "An error occurred during registration";

      if (error.message.includes("400")) {
        errorMessage = i18n.auth.invalid_data || "Invalid data provided";
      } else if (error.message.includes("401")) {
        errorMessage = i18n.auth.unauthorized || "Authentication failed";
      } else if (error.message.includes("403")) {
        errorMessage = i18n.auth.forbidden || "Access denied";
      } else if (error.message.includes("404")) {
        errorMessage = i18n.auth.not_found || "Resource not found";
      } else if (error.message.includes("500")) {
        errorMessage = i18n.auth.server_error || "Server error occurred";
      } else if (
        error.message.toLowerCase().includes("network") ||
        error.message.toLowerCase().includes("fetch")
      ) {
        errorMessage = i18n.auth.network_error || "Network connection failed";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Toast.error(errorMessage);
      setIsSaving(false);
    }
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
        {i18n.auth.complete_personal_infos}
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
      <div className={styles.container}>
        <div className={styles.contentLg}>
          <h1 className={styles.title}>{i18n.auth.complete_personal_infos}</h1>

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
                    onKeyUp={(e) => handleKeyUp(e.target.name, e.target.value)}
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
                    onKeyUp={(e) => handleKeyUp(e.target.name, e.target.value)}
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
                    onKeyUp={(e) => handleKeyUp(e.target.name, e.target.value)}
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
              {password && !hasPassword && (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "8px 0 4px",
                    fontSize: "12px",
                  }}
                >
                  {[
                    {
                      key: "minLength",
                      label: i18n.auth.pwd_min_length || "Minimum 8 characters",
                    },
                    {
                      key: "hasUppercase",
                      label:
                        i18n.auth.pwd_uppercase ||
                        "At least one uppercase letter (A-Z)",
                    },
                    {
                      key: "hasLowercase",
                      label:
                        i18n.auth.pwd_lowercase ||
                        "At least one lowercase letter (a-z)",
                    },
                    {
                      key: "hasDigit",
                      label: i18n.auth.pwd_digit || "At least one digit (0-9)",
                    },
                    {
                      key: "hasSpecial",
                      label:
                        i18n.auth.pwd_special ||
                        "At least one special character (!@#$%...)",
                    },
                  ].map(({ key, label }) => (
                    <li
                      key={key}
                      style={{
                        color: pwdRules[key] ? "#06d9b1" : "#fe3745",
                        marginBottom: "2px",
                      }}
                    >
                      {pwdRules[key] ? "✓" : "✗"} {label}
                    </li>
                  ))}
                </ul>
              )}

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
              <Checkbox checked={isAccepted} onClick={handleCheckboxClick} />
              <label className={styles.checkbox} onClick={handleCheckboxClick}>
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
                {i18n.auth.complete_profile_button || "Compléter profil"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoPeopleRegistrationModal;
