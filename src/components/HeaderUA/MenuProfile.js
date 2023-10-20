import React, { useEffect, useState } from "react";

import styles from "./Header.module.scss";
import { Avatar } from "../Avatar/Avatar";
import { saveAgreation } from "../../api";
import { getApiUrl } from "../../utils";
import { SOCIAL_NETWORKS_HOSTS } from "../../config";
import AgreationNumber from "./AgreationNumber";

const I18N = {
  en: {
    logout: "Logout",
    profile: "Profile",
    uen_label_number: "Personal number",
    select: "Choose",
    uen_label: "You are",
    title: "Title",
    "inscription.itaa": "I.T.A.A.",
    "inscription.membre_itaa": "Member I.T.A.A.",
    "inscription.stagiaire_itaa": "Trainee I.T.A.A.",
    "inscription.collaborateur_itaa":
      "Collaborator in a cabinet approved I.T.A.A.",
    "inscription.ire": "I. R. E.",
    "inscription.membre_ire": "Member I. R. E.",
    "inscription.stagiaire_ire": "Trainee I. R. E.",
    "inscription.collaborateur_ire": "Employee in a firm of chartered I. R. E.",
    "inscription.entreprise": "Independent business institute",
    "inscription.salarie": "I work as an employee",
    "inscription.independant": "I work in a company as an independent",
    "inscription.enseignement": "Education",
    "inscription.etudiant": "Student",
    "inscription.enseignant": "Professor",
    "inscription.autre": "Other",
    "inscription.interne": "Intern",
    "inscription.externe": "Extern",
    no_personal_data: "No personal data found",
    required_field: "Required field",
    attestation_profile: "Attestation Profile",
    cancel: "Cancel",
    save: "Save",
    you_are_registered_as: "You are registered as",
    edit: "Edit",
  },
  fr: {
    logout: "Se déconnecter",
    profile: "Profil",
    uen_label_number: "Numéro personnel",
    select: "Choisissez",
    uen_label: "Vous êtes",
    title: "Titre",
    "inscription.itaa": "I.T.A.A.",
    "inscription.membre_itaa": "Membre I.T.A.A.",
    "inscription.stagiaire_itaa": "Stagiaire I.T.A.A.",
    "inscription.collaborateur_itaa":
      "Collaborateur dans un cabinet agréé I.T.A.A.",
    "inscription.ire": "I.R.E.",
    "inscription.membre_ire": "Membre I.R.E.",
    "inscription.stagiaire_ire": "Stagiaire I.R.E.",
    "inscription.collaborateur_ire":
      "Collaborateur dans un cabinet agréé I.R.E.",
    "inscription.entreprise": "Entreprise indépendante d'un institut",
    "inscription.salarie": "Je travaille comme salarié",
    "inscription.independant": "Je travaille en entreprise comme indépendant",
    "inscription.enseignement": "Enseignement",
    "inscription.etudiant": "Etudiant",
    "inscription.enseignant": "Professeur",
    "inscription.autre": "Autre",
    "inscription.interne": "Interne",
    "inscription.externe": "Externe",
    no_personal_data: "Aucune donnée personnelle trouvée",
    required_field: "Ce champ est obligatoire",
    attestation_profile: "Profil d'attestation",
    cancel: "Annuler",
    save: "Enregistrer",
    you_are_registered_as: "Vous êtes inscrit en tant que",
    edit: "Modifier",
  },
  nl: {
    logout: "Uitloggen",
    profile: "Profiel",
    uen_label_number: "Persoonlijk nummer",
    select: "Kies",
    uen_label: "Jij bent",
    title: "Titel",
    "inscription.itaa": "ITAA",
    "inscription.membre_itaa": "Lid ITAA",
    "inscription.stagiaire_itaa": "Stagiair ITAA",
    "inscription.collaborateur_itaa": "Medewerker van een ITAA-vennootschap",
    "inscription.ire": "IBR",
    "inscription.membre_ire": "Lid IBR",
    "inscription.stagiaire_ire": "Stagiair IBR",
    "inscription.collaborateur_ire":
      "Medewerker van een kantoor dat door het IBR erkend is",
    "inscription.entreprise": "Onderneming - niet verbonden aan een instituut",
    "inscription.salarie": "Ik werk als bediende",
    "inscription.independant": "Ik werk als zelfstandige voor een onderneming",
    "inscription.enseignement": "Onderwijs",
    "inscription.etudiant": "Student",
    "inscription.enseignant": "Leraar",
    "inscription.autre": "Andere",
    "inscription.interne": "Intern",
    "inscription.externe": "Extern",
    no_personal_data: "Geen persoonsgegevens gevonden",
    required_field: "Dit veld is verplicht",
    attestation_profile: "Attestation profiel",
    cancel: "Annuleren",
    save: "Opnemen",
    you_are_registered_as: "U bent geregistreerd als",
    edit: "Bewerken",
  },
};

const accesGratuiteOptions = [
  {
    label: "inscription.itaa",
    options: [
      { label: "inscription.membre_itaa", value: "mItaa" },
      { label: "inscription.stagiaire_itaa", value: "sItaa" },
      { label: "inscription.collaborateur_itaa", value: "cItaa" },
    ],
  },
  {
    label: "inscription.ire",
    options: [
      { label: "inscription.membre_ire", value: "mIre" },
      { label: "inscription.stagiaire_ire", value: "sIre" },
      { label: "inscription.collaborateur_ire", value: "cIre" },
    ],
  },
  {
    label: "inscription.entreprise",
    options: [
      { label: "inscription.salarie", value: "salarie" },
      { label: "inscription.independant", value: "independant" },
    ],
  },
  {
    label: "inscription.enseignement",
    options: [
      { label: "inscription.etudiant", value: "student" },
      { label: "inscription.enseignant", value: "teacher" },
    ],
  },
  { label: "inscription.autre", value: "autre" },
];

export const validateUen = (uen) => {
  const formattedUen = uen.replace(
    /(BE|be)? ?(\d{4})[. ]?(\d{3})[. ]?(\d{3})/,
    "BE $2.$3.$4"
  );
  return /^[a-zA-Z]{2} (\d{4})[. ]?(\d{3})[. ]?(\d{3})$/.test(formattedUen);
};

export default function MenuProfile(props) {
  const {
    env,
    auth,
    user,
    lng,
    rightIcons,
    firstList,
    secondList,
    thirdList,
    navigateTo,
    showPersonalData,
    personalData,
    onAfterSavePersonal,
    showProfileLink,
    disableLanguageChange = false,
  } = props;

  const AGREATION_TYPE_OPTIONS = [
    { label: I18N[lng]["inscription.interne"], value: "interne" },
    { label: I18N[lng]["inscription.externe"], value: "externe" },
  ];

  const [numeroAgreation, setNumeroAgreation] = useState("");
  const [agreation, setAgreation] = useState(null);
  const [agreationType, setAgreationType] = useState(null);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [agreationError, setAgreationError] = useState("");
  const [numeroAgreationError, setNumeroAgreationError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [agreationTypeError, setAgreationTypeError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(personalData);

  const {
    avatarUrl,
    firstName,
    lastName,
    mainEmail,
    contactSocialNetworks,
  } = user;
  const languages = ["fr", "nl", "en"];

  const apiUrl = getApiUrl(env);

  useEffect(() => {
    if (showPersonalData && personalData) {
      if (personalData.numeroAgreation) {
        setNumeroAgreation(personalData.numeroAgreation);
      }
      if (personalData.agreationType) {
        let tmp = null;
        accesGratuiteOptions.forEach((i) => {
          if (i.options) {
            let result = i.options.filter(
              (it) => it.value === personalData.agreationType
            );
            if (result.length > 0) {
              tmp = result[0];
            }
          } else {
            if (i.value === personalData.agreationType) {
              tmp = i;
            }
          }
        });
        if (tmp) {
          setAgreation(tmp);
        }
      }
      if (personalData.agreationTitle) {
        setTitle(personalData.agreationTitle);
      }
      if (personalData.agreationParam) {
        const tmp = AGREATION_TYPE_OPTIONS.filter(
          (i) => i.value === personalData.agreationParam
        );
        if (tmp.length > 0) {
          setAgreationType(tmp[0]);
        }
      }
    }
  }, [personalData]);

  const validateForm = () => {
    let hasError = false;
    let hasAgreationError = false;
    setAgreationError(!agreation ? I18N[lng].required_field : "");
    setTitleError(!title ? I18N[lng].required_field : "");
    if (
      agreation &&
      ["mItaa", "sItaa", "cItaa", "mIre", "sIre", "cIre"].includes(
        agreation.value
      )
    ) {
      const uen = numeroAgreation
        .replaceAll(".", "")
        .replaceAll(" ", "")
        .replaceAll("_", "");
      if (["mItaa", "sItaa", "cItaa"].includes(agreation.value)) {
        setNumeroAgreationError(uen.length < 8 ? I18N[lng].required_field : "");
        if (uen.length < 8) {
          hasAgreationError = true;
        }
      } else if (["mIre", "sIre", "cIre"].includes(agreation.value)) {
        setNumeroAgreationError(uen.length < 6 ? I18N[lng].required_field : "");
        if (uen.length < 6) {
          hasAgreationError = true;
        }
      }
      setAgreationTypeError(!agreationType ? I18N[lng].required_field : "");
      if (!agreationType) {
        hasAgreationError = true;
      }
    } else {
      setNumeroAgreationError("");
      setAgreationTypeError("");
    }
    hasError = !agreation || !title || hasAgreationError;
    return hasError;
  };

  const handleSave = () => {
    const hasError = validateForm();
    if (hasError) {
      return null;
    }
    let data = {
      id: user.id,
      agreationType: agreation.value,
      agreationTitle: title,
      numeroAgreation: numeroAgreation
        .replaceAll(".", "")
        .replaceAll(" ", "")
        .replaceAll("_", ""),
      agreationParam: agreationType ? agreationType.value : "",
    };
    setIsSaving(true);
    saveAgreation({
      token: auth.token,
      apiUrl,
      userId: user.id,
      data: JSON.stringify(data),
    })
      .then((resp) => {
        if (onAfterSavePersonal) {
          onAfterSavePersonal(data);
        }
        setUserData(data);
        setIsSaving(false);
        setShowForm(false);
      })
      .catch((e) => {
        setIsSaving(false);
      });
  };

  const formatData = () => {
    const { numeroAgreation, agreationType, agreationTitle, agreationParam } =
      userData ?? {};

    let data = [];

    if (agreationType) {
      let tmp = null;
      accesGratuiteOptions.forEach((i) => {
        if (i.options) {
          let result = i.options.filter((it) => it.value === agreationType);
          if (result.length > 0) {
            tmp = result[0];
          }
        } else {
          if (i.value === agreationType) {
            tmp = i;
          }
        }
      });
      if (tmp) {
        data.push(I18N[lng][tmp.label]);
      }
    }

    if (agreationTitle) {
      data.push(agreationTitle);
    }

    if (numeroAgreation) {
      data.push(numeroAgreation);
    }

    if (agreationParam) {
      data.push(agreationParam);
    }

    if (data.length == 0) {
      return I18N[lng].no_personal_data;
    }

    return data.join(" / ");
  };

  const renderContactSocialNetworkBlock = (
    contactSocialNetworks,
    socialNetworkName
  ) => {
    if (!contactSocialNetworks) {
      return null;
    }

    const socialNetwork = contactSocialNetworks[socialNetworkName];

    if (socialNetwork) {
      let accessValue =
        socialNetworkName === "twitter"
          ? socialNetwork.username
          : socialNetwork.id;
      let snUrl =
        socialNetworkName === "linkedin"
          ? socialNetwork.publicProfileUrl
            ? socialNetwork.publicProfileUrl
            : ""
          : `${
              SOCIAL_NETWORKS_HOSTS[socialNetworkName.toUpperCase()]
            }/${accessValue}`;

      return (
        <li className="social">
          <a href={`${snUrl}`} target="_blank">
            <i className={`icon-sb-${socialNetworkName}`} />
          </a>
        </li>
      );
    }

    return null;
  };

  const avatarDiv = avatarUrl ? (
    <Avatar
      avatarUrl={avatarUrl}
      firstName={firstName}
      lastName={lastName}
      showInfo={false}
      noMargin={true}
    />
  ) : (
    <Avatar firstName={firstName} lastName={lastName} showInfo={false} />
  );

  return (
    <ul className={styles.menu}>
      <li
        className={`${styles.expandable} ${styles.menuImg} ${styles.profile}`}
      >
        {avatarDiv}
        <ul className={`${styles.menuDropdown}`}>
          <li className={styles.profileContainer}>
            <Avatar
              avatarUrl={avatarUrl}
              firstName={firstName}
              lastName={lastName}
              avatarSignature={mainEmail}
            />
          </li>
          {showProfileLink && (
            <li className={`${styles.menuProfile}`}>
              <a href={rightIcons.profile.url}>{I18N[lng]["profile"]}</a>
            </li>
          )}

          {showPersonalData && (
            <li className={styles.personalData}>
              <span className={styles.personalData_title}>
                {I18N[lng].attestation_profile}
              </span>
              {showForm ? (
                <>
                  <AgreationNumber
                    numeroAgreation={numeroAgreation}
                    agreation={agreation}
                    setAgreation={(value) => setAgreation(value)}
                    setNumeroAgreation={(value) => setNumeroAgreation(value)}
                    small={true}
                    AGREATION_OPTIONS={accesGratuiteOptions}
                    AGREATION_TYPE_OPTIONS={AGREATION_TYPE_OPTIONS}
                    I18N={I18N}
                    lng={lng}
                    agreationType={agreationType}
                    setAgreationType={setAgreationType}
                    agreationError={agreationError}
                    setAgreationError={setAgreationError}
                    numeroAgreationError={numeroAgreationError}
                    setNumeroAgreationError={setNumeroAgreationError}
                    agreationTypeError={agreationTypeError}
                  />
                  <div>
                    <label className="ttp-label">{I18N[lng].title}</label>
                    <input
                      type="text"
                      className={styles.input}
                      autocomplete="off"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <span className={styles.error}>{titleError}</span>
                  </div>
                  <div className={styles.personalData_actions}>
                    <span
                      onClick={() => setShowForm(false)}
                      className={styles.personalData_cancel}
                    >
                      {I18N[lng].cancel}
                    </span>
                    {isSaving ? (
                      <span className={styles.personalData_save}>...</span>
                    ) : (
                      <span
                        onClick={handleSave}
                        className={styles.personalData_save}
                      >
                        {I18N[lng].save}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span>{I18N[lng].you_are_registered_as}:</span>
                  <span>
                    {/* {agreation ? I18N[lng][agreation.label] : ""} / {title} /{" "}
                    {numeroAgreation ? numeroAgreation : ""} /
                    {agreationType ? agreationType.label : ""} */}
                    {formatData()}
                  </span>

                  <span
                    className={styles.personalData_edit}
                    onClick={() => setShowForm(true)}
                  >
                    {I18N[lng].edit}
                  </span>
                </>
              )}
            </li>
          )}
          {!disableLanguageChange && (
            <li className={styles.menuLanguage}>
              <ul>
                {languages.map((language) => (
                  <li
                    id={language}
                    key={language}
                    className={lng === language ? styles.selected : ""}
                    onClick={() => props.onLanguageChange(language)}
                  >
                    {language.toUpperCase()}
                  </li>
                ))}
              </ul>
            </li>
          )}
          <li className={styles.social}>
            <ul>
              {renderContactSocialNetworkBlock(
                contactSocialNetworks,
                "facebook"
              )}
              {renderContactSocialNetworkBlock(
                contactSocialNetworks,
                "twitter"
              )}
              {renderContactSocialNetworkBlock(
                contactSocialNetworks,
                "linkedin"
              )}
            </ul>
          </li>
          {(firstList || secondList || thirdList) && (
            <li className={styles.footerItems}>
              <ul>
                {firstList && (
                  <li className={styles.section}>
                    <ul>
                      {firstList.map((el) => (
                        <li onClick={() => navigateTo(el.url)}>
                          <div className={styles.block}></div>
                          <span>{el.label}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                {secondList && (
                  <li className={styles.section}>
                    <ul>
                      {secondList.map((el) => (
                        <li onClick={() => navigateTo(el.url)}>
                          <div className={styles.block}></div>
                          <span>{el.label}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                {thirdList && (
                  <li className={styles.section}>
                    <ul>
                      {thirdList.map((el) => (
                        <li onClick={() => navigateTo(el.url)}>
                          <div className={styles.block}></div>
                          <span>{el.label}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
              </ul>
            </li>
          )}
          <li className={styles.logout} onClick={(e) => props.onLogoutClick(e)}>
            {I18N[lng]["logout"]}
          </li>
        </ul>
      </li>
    </ul>
  );
}
