import React from "react";
import cn from "classnames";
import styles from "./registration-fiduciare-type.module.scss";
import { I18N } from "../../../../i18n";
import classNames from "classnames";

export default function RegistrationFiduciaireType({
  token,
  product,
  user,
  language,
  env,
  fiduciaires,
  setView,
  setFiduciaire,
  closeModal,
}) {
  if (fiduciaires.length === 1) {
    setView("BOOK");
    setFiduciaire(fiduciaires[0]);
    // openBookEventRegistrationModal(
    //   token,
    //   product,
    //   user,
    //   language,
    //   env,
    //   fiduciaires[0]
    // );
  }

  const translate = (text) => {
    return I18N[language][text];
  };

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.header}>
        <span>{translate("fiduciaries")}</span>
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
      <div className={styles.body}>
        <div className={styles.title}>{translate("chooseFiduciaites")} : </div>
        <div
          className={
            fiduciaires.lenght > 3
              ? classNames(styles.fiduciaires)
              : classNames(styles.fiduciaires, styles.center)
          }
        >
          {fiduciaires.map((fiduciaire, index) => (
            <div
              className={styles.fiduciaire}
              key={index}
              onClick={() => {
                setView("BOOK");
                setFiduciaire(fiduciaire);
              }}
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
