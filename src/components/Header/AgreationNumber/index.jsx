import React, { useState } from "react";
import InputMask from "react-input-mask";

import styles from "./AgreationNumber.module.scss";

const AgreationNumber = ({
  numeroAgreation,
  agreation,
  setAgreation,
  agreationType,
  setAgreationType,
  setNumeroAgreation,
  small,
  agreationError,
  setAgreationError,
  numeroAgreationError,
  setNumeroAgreationError,
  agreationTypeError,
  hideAgreationSelect,
  AGREATION_OPTIONS,
  AGREATION_TYPE_OPTIONS,
  lng,
  I18N,
}) => {
  const [showList, setShowList] = useState(false);
  const [showTypeList, setShowTypeList] = useState(false);

  return (
    <>
      {!hideAgreationSelect && (
        <>
          <label className={`ttp-label ${!small && "ttp-label-lg"}`}>
            {I18N[lng]["uen_label"]}
          </label>
          <div
            className={`${styles.select_group} ${
              !small && styles.select_group_large
            }`}
          >
            <div className={styles.select}>
              <button
                className={showList ? styles.active_btn : ""}
                onClick={() => setShowList(!showList)}
              >
                {agreation ? I18N[lng][agreation.label] : I18N[lng].select}
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.77771 5.60814C5.37747 6.10332 4.62253 6.10332 4.22229 5.60814L1.12024 1.77036C0.591671 1.11642 1.05711 0.141741 1.89796 0.141741L8.10204 0.141741C8.94289 0.141742 9.40833 1.11642 8.87976 1.77036L5.77771 5.60814Z"
                    fill="#6D7F92"
                  />
                </svg>
              </button>
              {showList && (
                <ul className={styles.list}>
                  {AGREATION_OPTIONS.map((group) => (
                    <>
                      <li className={styles.list_optgroup}>
                        {I18N[lng][group.label]}
                      </li>
                      {group.options ? (
                        group.options.map((item) => (
                          <li
                            className={styles.list_option}
                            key={item.value}
                            onClick={() => {
                              setAgreation(item);
                              setShowList(false);
                              setAgreationError("");
                              if (
                                ![
                                  "mItaa",
                                  "sItaa",
                                  "cItaa",
                                  "mIre",
                                  "sIre",
                                  "cIre",
                                ].includes(item.value)
                              ) {
                                setNumeroAgreation("");
                                setAgreationType(null);
                              }
                            }}
                          >
                            {I18N[lng][item.label]}
                          </li>
                        ))
                      ) : (
                        <li
                          className={styles.list_option}
                          key={group.value}
                          onClick={() => {
                            setAgreation(group);
                            setShowList(false);
                            setAgreationError("");
                            if (
                              ![
                                "mItaa",
                                "sItaa",
                                "cItaa",
                                "mIre",
                                "sIre",
                                "cIre",
                              ].includes(group.value)
                            ) {
                              setNumeroAgreation("");
                              setAgreationType(null);
                            }
                          }}
                        >
                          {I18N[lng][group.label]}
                        </li>
                      )}
                    </>
                  ))}
                </ul>
              )}
            </div>
            <span className={styles.error}>{agreationError}</span>
          </div>
        </>
      )}

      <div className={styles.license_number}>
        {agreation && ["mItaa", "sItaa", "cItaa"].includes(agreation.value) && (
          <>
            <label className={`ttp-label ${!small && "ttp-label-lg"}`}>
              {I18N[lng]["uen_label_number"]}
            </label>
            <div className={styles.agreation}>
              <InputMask
                mask="99 . 999 . 999"
                maskChar="_"
                alwaysShowMask={true}
                name="numeroAgreation"
                value={numeroAgreation}
                onChange={(e) => setNumeroAgreation(e.target.value)}
              />
            </div>
            <span className={styles.error}>{numeroAgreationError}</span>
          </>
        )}
        {agreation && ["mIre", "sIre", "cIre"].includes(agreation.value) && (
          <>
            <label className={`ttp-label ${!small && "ttp-label-lg"}`}>
              {I18N[lng]["uen_label_number"]}
            </label>
            <div className={styles.agreation}>
              <InputMask
                mask="a . 99999"
                maskChar="_"
                alwaysShowMask={true}
                name="numeroAgreation"
                value={numeroAgreation}
                onChange={(e) => setNumeroAgreation(e.target.value)}
              />
            </div>
            <span className={styles.error}>{numeroAgreationError}</span>
          </>
        )}
        {agreation &&
          ["mItaa", "sItaa", "cItaa", "mIre", "sIre", "cIre"].includes(
            agreation.value
          ) && (
            <>
              <label className={`ttp-label ${!small && "ttp-label-lg"}`}>
                {I18N[lng]["uen_label"]}
              </label>
              <div
                className={`${styles.select_group} ${
                  !small && styles.select_group_large
                }`}
              >
                <div className={styles.select}>
                  <button
                    className={showTypeList ? styles.active_btn : ""}
                    onClick={() => setShowTypeList(!showTypeList)}
                  >
                    {agreationType ? agreationType.label : I18N[lng].select}
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.77771 5.60814C5.37747 6.10332 4.62253 6.10332 4.22229 5.60814L1.12024 1.77036C0.591671 1.11642 1.05711 0.141741 1.89796 0.141741L8.10204 0.141741C8.94289 0.141742 9.40833 1.11642 8.87976 1.77036L5.77771 5.60814Z"
                        fill="#6D7F92"
                      />
                    </svg>
                  </button>
                  {showTypeList && (
                    <ul className={styles.list}>
                      {AGREATION_TYPE_OPTIONS.map((item) => (
                        <li
                          className={styles.list_option}
                          key={item.value}
                          onClick={() => {
                            setAgreationType(item);
                            setShowTypeList(false);
                          }}
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <span className={styles.error}>{agreationTypeError}</span>
            </>
          )}
      </div>
    </>
  );
};

export default AgreationNumber;
