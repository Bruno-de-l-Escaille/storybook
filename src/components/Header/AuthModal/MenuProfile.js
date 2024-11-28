import styles from "./MenuProfile.module.scss";
import { Avatar } from "../common/Avatar/Avatar";

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

export default function MenuProfile({ user, lng, onLogoutClick }) {
  const { avatarUrl, firstName, lastName, mainEmail } = user;
  const languages = ["fr", "nl"];

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

          <li className={`${styles.logout} `} onClick={(e) => onLogoutClick(e)}>
            <button className="btn-style-1">{I18N[lng]["logout"]}</button>
          </li>
        </ul>
      </li>
    </ul>
  );
}
