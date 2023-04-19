import React, { useState } from "react";
import ReactCodeInput from "react-code-input";

import _ from "../../../i18n";
import { AGREATION_OPTIONS } from "../../../config";
import FormInput from "../../common/FormInput";

import styles from "./AgreationNumber.module.scss";

const InlineAgreationNumber = ({
  NumeroAgreation,
  Agreation,
  setAgreation,
  setNumeroAgreation,
  small,
  error,
}) => {
  const [showList, setShowList] = useState(false);
  const props = {
    className: styles.codeInput,
    inputStyle: {
      marginRight: small ? "0.3rem" : "0.463rem",
      width: small ? "25px" : "34px",
      borderRadius: "4px",
      fontSize: small ? "12px" : "14px",
      height: small ? "34px" : "44px",
      backgroundColor: "#F8F9FA",
      border: "1px solid #B6BFC8",
      textAlign: "center",
    },
  };

  return (
    <div className={styles.inline}>
      <div
        className={`${styles.select_group} ${
          !small && styles.select_group_large
        }`}
      >
        <div>
          <label class="FormInput_label__wZql0">
            {_("uen_as")}
            <span class="FormInput_star__aCAcx">*</span>
          </label>
          <div className={styles.select}>
            <button
              className={showList ? styles.active_btn : ""}
              onClick={() => setShowList(!showList)}
            >
              {Agreation && _(`${Agreation.label}`)}
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
                {AGREATION_OPTIONS.map((item) => (
                  <li
                    key={item.value}
                    onClick={() => {
                      setAgreation(item);
                      setShowList(false);
                    }}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {!Agreation ||
        (Agreation && ["ITAA", "IRE_AUDIT"].includes(Agreation.value) && (
          <div className={styles.inline_right}>
            <label className={`ttp-label ${!small && "ttp-label-lg"}`}>
              {_("uen_label_number")}
            </label>

            <div className={styles.license_number}>
              {Agreation && Agreation.value === "ITAA" && (
                <ReactCodeInput
                  type="number"
                  fields={8}
                  value={NumeroAgreation ? NumeroAgreation : ""}
                  onChange={(value) => setNumeroAgreation(value)}
                  {...props}
                  autoFocus={false}
                />
              )}
              {Agreation && Agreation.value === "IRE_AUDIT" && (
                <ReactCodeInput
                  type="text"
                  pattern="^([A-z][0-9]+)$"
                  fields={6}
                  value={NumeroAgreation ? NumeroAgreation : ""}
                  onChange={(value) => setNumeroAgreation(value)}
                  {...props}
                  autoFocus={false}
                />
              )}
              {/* {!Agreation ||
            (Agreation && !["ITAA", "IRE_AUDIT"].includes(Agreation.value) && (
              <input
                type="text"
                value={NumeroAgreation ? NumeroAgreation : ""}
                onChange={(e) => setNumeroAgreation(e.target.value)}
                className={`${styles.input} ${!small && styles.input_large}`}
              />
            ))} */}
              <span className={styles.error}>{error}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default InlineAgreationNumber;
