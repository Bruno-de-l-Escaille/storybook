import React from "react";
import cn from "classnames";
import styles from "./registration-fiduciare-type.module.scss";
import { I18N } from "../../../../i18n";
import { useEventBookRegistrationModal } from "../../modal/event-book-registration/use-event-book-registration-modal";

export default function RegistrationFiduciaireType({
  token,
  product,
  user,
  language,
  env,
  fiduciaires,
}) {
  // const [fiduciaires, setFiduciaires] = useState([]);
  // const [isFetching, setIsFetching] = useState(false);
  const translate = (text) => {
    return I18N[language][text];
  };
  const { openBookEventRegistrationModal } = useEventBookRegistrationModal();

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.header}>
        <span>{translate("fiduciaries")}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{translate("chooseFiduciaites")} : </div>
        <div className={styles.fiduciaires}>
          {fiduciaires.map((fiduciaire, index) => (
            <div
              className={styles.fiduciaire}
              key={index}
              onClick={() =>
                openBookEventRegistrationModal(
                  token,
                  product,
                  user,
                  language,
                  env,
                  fiduciaire
                )
              }
            >
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url(${fiduciaire.avatarUrl ?? ""})`,
                }}
              ></div>
              <div className={styles.title}>{fiduciaire.name}</div>
              <div className={styles.description}>{fiduciaire.type}</div>
              {/* <div className={styles.action}> */}
              {/* <button {...action} />
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // const translate = (text) => {
  //   return I18N[language][text];
  // };

  // const types = [
  //   {
  //     title: translate("personal"),
  //     icon: <UserIcon />,
  //     description: translate("personalRegistrationDescription"),
  //     action: {
  //       children: translate("personalRegistration"),
  //       onClick: () => openRegistration(),
  //     },
  //   },
  //   {
  //     title: translate("fiduciaries"),
  //     icon: <TicketIcon />,
  //     description: translate("fiduciariesRegistrationDescription"),
  //     action: {
  //       children: translate("buyFiduciares"),
  //       onClick: () => openFiduciareRegistration(),
  //     },
  //   },
  // ];

  // return (
  //   <div className={cn(styles.wrapper)}>
  //     <div className={styles.header}>
  //       <span>{translate("registrationType")}</span>
  //     </div>
  //     <div className={styles.body}>
  //       <div className={styles.title}>
  //         {translate("chooseRegistrationType")} :{" "}
  //       </div>
  //       <div className={styles.types}>
  //         {types.map(({ icon, title, description, action }, index) => (
  //           <div className={styles.type} key={index}>
  //             <div className={styles.icon}>{icon}</div>
  //             <div className={styles.title}>{title}</div>
  //             <div className={styles.description}>{description}</div>
  //             <div className={styles.action}>
  //               <button {...action} />
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
}
