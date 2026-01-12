import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import styles from "./AddGuestModal.module.scss";
import IconX from "../../../../Icons/IconX";
import IconAddGuest from "../../../../Icons/IconAddGuest";
import Select from "react-select";
import { I18N } from "../../../../../i18n";
import IconWarningInfo from "../../../../Icons/IconWarningInfo";
import { getApiUrl, isEmpty } from "../../../../../utils";
import EmailTagsInput from "./EmailTagsInput";
import classNames from "classnames";
import { createUserByEmail, forceGuest } from "../../../../../api";
import IconCheck from "../../../../Icons/IconCheck";
import IconAdd from "../../../../Icons/IconAdd";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export const AddGuestModal = ({
  isOpen,
  onClose,
  lang = "fr",
  env,
  token,
  eventId,
  queryClient,
}) => {
  const [selectedGuestsStatus, setSelectedStatus] = useState({
    value: "add",
    label: I18N[lang]["toInvite"],
    color: "#6D7F92",
  });
  const [tags, setTags] = useState([]);

  const [isSaving, setIsSaving] = useState(false);

  const [confirmationChecked, setConfirmationChecked] = useState("yes");

  const [emailToAdd, setEmailToAdd] = useState("");

  const [forceGuestData, setForceGuestData] = useState([]);
  const [formData, setFormData] = useState({
    email: emailToAdd,
    firstName: "",
    lastName: "",
    gender: "",
    language: lang || "fr",
  });

  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    language: "",
  });
  const handleClose = () => {
    const hasSuccess = Object.entries(forceGuestData).some(
      ([email, data]) => data.result === "ok"
    );
    if (hasSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["bo-guests"],
      });
    }
    setForceGuestData([]);
    setEmailToAdd("");
    setConfirmationChecked("yes");
    setTags([]);
    onClose();
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      gender: "",
      language: lang || "fr",
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      email: emailToAdd,
    });
  }, [emailToAdd]);

  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      gender: "",
      language: "",
    };

    let isValid = true;

    if (!formData.firstName.trim()) {
      errors.firstName =
        I18N[lang]["fieldRequired"] || "Ce champ est obligatoire";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName =
        I18N[lang]["fieldRequired"] || "Ce champ est obligatoire";
      isValid = false;
    }

    if (!formData.gender) {
      errors.gender = I18N[lang]["fieldRequired"] || "Ce champ est obligatoire";
      isValid = false;
    }

    if (!formData.language) {
      errors.language =
        I18N[lang]["fieldRequired"] || "Ce champ est obligatoire";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const genderOptions = [
    { value: "MALE", label: I18N[lang]["auth"]["male"] || "Homme" },
    { value: "FEMALE", label: I18N[lang]["auth"]["female"] || "Femme" },
    { value: "OTHER", label: I18N[lang]["other"] || "Autre" },
  ];

  const languageOptions = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "nl", label: "Nederlands" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSaveNewUser = async () => {
    if (!validateForm()) {
      return;
    }
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.gender ||
      !formData.language
    ) {
      alert(
        I18N[lang]["pleaseFillAllFields"] || "Veuillez remplir tous les champs"
      );
      return;
    }

    setIsSaving(true);

    try {
      await createUserByEmail({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        language: formData.language,
        apiUrl,
        token,
      });

      const forceGuestResponse = await forceGuest({
        emails: formData.email,
        eventId,
        fromBackOffice: 1,
        type: selectedGuestsStatus.value,
        apiUrl,
        token,
        sendEmail:
          selectedGuestsStatus.value === "add" && confirmationChecked === "no"
            ? 0
            : 1,
      });

      if (forceGuestResponse && forceGuestResponse.data) {
        setForceGuestData((prevData) => {
          const updatedData = { ...prevData };
          delete updatedData[formData.email];
          return {
            ...updatedData,
            ...forceGuestResponse.data,
          };
        });
      }
      setEmailToAdd("");
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        I18N[lang]["errorCreatingUser"] ||
          "Erreur lors de la création de l'utilisateur"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isValidEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };
  const apiUrl = getApiUrl(env);

  const guestsStatus = useMemo(
    () => [
      {
        value: "add",
        label: I18N[lang]["toInvite"],
        color: "#6D7F92",
      },
      {
        value: "register",
        label: I18N[lang]["accepted"],
        color: "#02AF8E",
      },
    ],
    [lang]
  );

  const handleSave = async () => {
    setIsSaving(true);
    forceGuest({
      emails: tags.join(", "),
      eventId,
      fromBackOffice: 1,
      type: selectedGuestsStatus.value,
      apiUrl,
      token,
      sendEmail:
        selectedGuestsStatus.value === "add" && confirmationChecked === "no"
          ? 0
          : 1,
    })
      .then((response) => {
        setForceGuestData(response.data);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  const handleChange = (selected) => {
    setSelectedStatus(selected);
  };
  const getSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "32px",
      height: "32px",
      border: "0.5px solid #29394D",
      borderRadius: "12px",
      background: "#F1F2F4",
      borderWidth: "0.5px",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": {
        borderColor: state.menuIsOpen ? "#29394D" : "#b2bcc6",
      },
      textTransform: "capitalize",
    }),
    valueContainer: (base) => ({
      ...base,
      height: "32px",
      padding: "0 10px",
    }),
    placeholder: (base) => ({
      ...base,
      fontFamily: "Roboto",
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: 400,
      lineHeight: "140%",
    }),
    input: (base) => ({
      ...base,
      margin: "0",
      padding: "0",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "32px",
    }),
    menu: (base) => ({
      ...base,
      marginTop: "4px",
      borderRadius: "8px",
      border: "0.5px solid #e1e4e8",
      boxShadow: "0 4px 12px rgba(41, 57, 77, 0.1)",
    }),
    menuList: (base) => ({
      ...base,
      padding: "4px",
      borderRadius: "8px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled
        ? "white"
        : state.isSelected
        ? "#f3faff"
        : state.isFocused
        ? "#f4f7f9"
        : "white",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      padding: "8px 10px",
      borderRadius: "6px",
      margin: "2px 0",
      fontSize: "12px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: 600,
      opacity: state.isDisabled ? 0.6 : 1,
      textTransform: "capitalize",
      lineHeight: "140%",
      textOverflow: "ellipsis",
      color: state.data.color || "#6D7F92",

      "&:active": {
        backgroundColor: state.isDisabled ? "white" : "#F1F2F4",
      },
    }),
    singleValue: (base, state) => ({
      ...base,
      fontSize: "12px",
      fontFamily: "Roboto, sans-serif",
      fontWeight: 600,
      margin: 0,
      color: state.data.color || "#29394D",
    }),
    multiValue: (base) => ({
      ...base,
      borderRadius: "5px",
      background: "#C7E8FE",
      boxShadow: "0 0 10px 0 rgba(41, 57, 77, 0.10)",
      color: "#29394D",
      textAlign: "center",
      fontFamily: "Roboto",
      fontSize: "12px",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "normal",
      textTransform: "uppercase",
    }),
  };
  const renderAddGuestResult = () => {
    return (
      <>
        <div className={styles.resultContent}>
          <div className={styles.section}>
            <div className={styles.title}>
              Success <IconCheck />
            </div>
            <div className={styles.divider} />
            <div className={styles.resultHeader}>
              <span className={styles.resultHeaderCell}>
                {I18N[lang].email}
              </span>
              <span className={styles.resultHeaderCell}>
                {I18N[lang].fullName1}
              </span>
            </div>
            <div className={styles.divider} />
            {Object.entries(forceGuestData).map(([email, data], index) => {
              if (data.result === "ok") {
                return (
                  <>
                    <div className={styles.resultRow}>
                      <span className={styles.resultCell}>{email}</span>
                      <span className={styles.resultCell}>
                        {data.guest.fullName}
                      </span>
                    </div>
                    <div className={styles.divider} />
                  </>
                );
              }
            })}
          </div>
          <div className={styles.section}>
            <div className={styles.title}>
              Error <IconX />
            </div>
            <div className={styles.divider} />
            <div className={styles.resultHeader}>
              <span
                className={classNames(
                  styles.resultHeaderCell,
                  styles.errorEmail
                )}
              >
                {I18N[lang].email}
              </span>
              <span className={styles.resultHeaderCell}>
                {I18N[lang].fullName1}
              </span>
            </div>
            <div className={styles.divider} />
            {Object.entries(forceGuestData).map(([email, data], index) => {
              let error = data.error;
              let canAdd = false;
              if (!isValidEmail(email)) {
                error = I18N[lang].invalidEmailAddress;
              }
              if (error === "User with this email does not exists") {
                error = I18N[lang][error];
                canAdd = true;
              }
              if (data.result === "nOk") {
                return (
                  <>
                    <div className={styles.resultRow}>
                      <span
                        className={classNames(
                          styles.resultCell,
                          styles.errorEmail
                        )}
                      >
                        {email}
                      </span>
                      <span className={styles.resultCell}>
                        {error}
                        {canAdd && (
                          <button
                            onClick={() => {
                              setEmailToAdd(email);
                              setFormData({
                                ...formData,
                                email: emailToAdd,
                              });
                            }}
                            data-tooltip={I18N[lang].createNewUser}
                          >
                            <IconAdd stroke={"#06d9b1"} />
                          </button>
                        )}
                      </span>
                    </div>{" "}
                    <div className={styles.divider} />
                  </>
                );
              }
            })}
          </div>
        </div>
        <div className={styles.footer}>
          <button className={styles.nextButton} onClick={handleClose}>
            Ok
          </button>
        </div>
      </>
    );
  };

  const renderAddUserForm = () => {
    return (
      <>
        <div className={styles.addUserFormSection}>
          <div className={styles.sectionTitle}>
            <IconAddGuest />
            {I18N[lang]["createNewUser"] || "Créer un nouvel utilisateur"}
          </div>

          <div className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{I18N[lang]["email"]}</label>
              <input
                type="email"
                value={emailToAdd}
                disabled
                className={classNames(styles.input, styles.disabledInput)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                {I18N[lang]["auth"]["firstName"] || "Prénom"}{" "}
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder={I18N[lang]["enterFirstName"] || "Entrez le prénom"}
                className={styles.input}
              />
              {validationErrors.firstName && (
                <span className={styles.errorMessage}>
                  {validationErrors.firstName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                {I18N[lang]["auth"]["lastName"] || "Nom"}{" "}
                <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder={I18N[lang]["enterLastName"] || "Entrez le nom"}
                className={styles.input}
              />
              {validationErrors.lastName && (
                <span className={styles.errorMessage}>
                  {validationErrors.lastName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                {I18N[lang]["auth"]["gender"] || "Genre"}{" "}
                <span className={styles.required}>*</span>
              </label>
              <Select
                value={genderOptions.find(
                  (opt) => opt.value === formData.gender
                )}
                onChange={(selected) =>
                  handleInputChange("gender", selected.value)
                }
                options={genderOptions}
                styles={getSelectStyles}
                placeholder={
                  I18N[lang]["selectGender"] || "Sélectionner le genre"
                }
                isSearchable={false}
              />
              {validationErrors.gender && (
                <span className={styles.errorMessage}>
                  {validationErrors.gender}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                {I18N[lang]["language"] || "Langue"}{" "}
                <span className={styles.required}>*</span>
              </label>
              <Select
                value={languageOptions.find(
                  (opt) => opt.value === formData.language
                )}
                onChange={(selected) =>
                  handleInputChange("language", selected.value)
                }
                options={languageOptions}
                styles={getSelectStyles}
                placeholder={
                  I18N[lang]["selectLanguage"] || "Sélectionner la langue"
                }
                isSearchable={false}
              />
              {validationErrors.language && (
                <span className={styles.errorMessage}>
                  {validationErrors.language}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.cancelButton}
            onClick={() => {
              setEmailToAdd("");
              setValidationErrors({
                firstName: "",
                lastName: "",
                gender: "",
                language: "",
              });
            }}
            disabled={isSaving}
          >
            {I18N[lang]["cancel"]}
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSaveNewUser}
            disabled={isSaving}
          >
            {isSaving && <ClipLoader size={16} color="#ffffff" />}
            {I18N[lang]["save"] || "Enregistrer"}
          </button>
        </div>
      </>
    );
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={{
        base: styles.modalContent,
        afterOpen: styles.modalContentAfterOpen,
        beforeClose: styles.modalContentBeforeClose,
      }}
      overlayClassName={{
        base: styles.modalOverlay,
        afterOpen: styles.modalOverlayAfterOpen,
        beforeClose: styles.modalOverlayBeforeClose,
      }}
      closeTimeoutMS={200}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <IconAddGuest width={20} height={20} />
            <span className={styles.headerTitle}>
              {" "}
              {I18N[lang]["addGuestManually"]}{" "}
            </span>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <IconX width={20} height={20} stroke="#29394D" />
          </button>
        </div>
        {isEmpty(forceGuestData) && (
          <>
            {" "}
            <div className={styles.content}>
              <div className={styles.section}>
                <div className={styles.emailfields}>
                  <label className={styles.fieldLabel}>Email(s)</label>

                  <EmailTagsInput tags={tags} setTags={setTags} lang={lang} />
                </div>
              </div>
              <div className={styles.divider} />
              <div className={styles.sectionInvite}>
                <div className={styles.leftPane}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>
                      {I18N[lang]["guestsStatus"]}
                    </label>
                    <Select
                      value={selectedGuestsStatus}
                      options={guestsStatus}
                      onChange={handleChange}
                      isSearchable={false}
                      styles={getSelectStyles}
                      hideSelectedOptions={false}
                      getOptionValue={(option) => option.value}
                      getOptionLabel={(option) => option.label}
                    />
                  </div>

                  <div className={styles.infoMessage}>
                    {selectedGuestsStatus.value === "add" &&
                      (I18N[lang]["usersWillNeedToConfirmTheirRegistration"] ??
                        "Les utilisateurs devront confirmer leur inscription.")}
                    {selectedGuestsStatus.value === "register" &&
                      (I18N[lang]["usersWillBeAutomaticallyRegistered"] ??
                        "Les utilisateurs seront automatiquement inscrits.")}
                  </div>
                </div>
                <div className={styles.verticalDivider} />
                <div className={styles.middlePane}>
                  {selectedGuestsStatus.value === "add" && (
                    <div className={styles.field}>
                      <div className={styles.fieldLabel}>
                        {I18N[lang]["confirmationRequest"]}
                      </div>
                      <div className={styles.checkboxRows}>
                        <div className={styles.checkboxRow}>
                          <label
                            className={
                              confirmationChecked === "yes"
                                ? classNames(
                                    styles.checkboxLabel,
                                    styles.active
                                  )
                                : styles.checkboxLabel
                            }
                          >
                            <input
                              type="radio"
                              name="active"
                              value="yes"
                              checked={confirmationChecked === "yes"}
                              onChange={(e) =>
                                setConfirmationChecked(e.target.value)
                              }
                            />
                            <span className={styles.checkboxText}>
                              {I18N[lang]["yesSendConfirmation"]}
                            </span>
                          </label>
                        </div>
                        <div className={styles.checkboxRow}>
                          <label
                            className={
                              confirmationChecked === "no"
                                ? classNames(
                                    styles.checkboxLabel,
                                    styles.active
                                  )
                                : styles.checkboxLabel
                            }
                          >
                            <input
                              type="radio"
                              name="active"
                              value="no"
                              checked={confirmationChecked === "no"}
                              onChange={(e) =>
                                setConfirmationChecked(e.target.value)
                              }
                            />
                            <span className={styles.checkboxText}>
                              {I18N[lang]["noDontSend"]}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedGuestsStatus.value === "register" && (
                    <div className={styles.infoMessage}>
                      <IconWarningInfo />
                      {I18N[lang]["confirmationEmailMessage"]}
                    </div>
                  )}
                </div>
                <div className={styles.rightPane}></div>
              </div>
              <div className={styles.divider} />
            </div>
            <div className={styles.footer}>
              <button className={styles.cancelButton} onClick={handleClose}>
                {" "}
                {I18N[lang]["cancel"]}
              </button>
              <button
                className={
                  isEmpty(tags)
                    ? classNames(styles.nextButton, styles.disabled)
                    : styles.nextButton
                }
                onClick={handleSave}
              >
                {isSaving && <ClipLoader size={16} color="#ffffff" />}
                {I18N[lang]["add"]}
              </button>
            </div>
          </>
        )}
        {!isEmpty(forceGuestData) &&
          isEmpty(emailToAdd) &&
          renderAddGuestResult()}
        {!isEmpty(forceGuestData) &&
          !isEmpty(emailToAdd) &&
          renderAddUserForm()}
      </div>
    </Modal>
  );
};

AddGuestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  guest: PropTypes.object,
  eventId: PropTypes.number.isRequired,
  apiUrl: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
  getGuestStatus: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
