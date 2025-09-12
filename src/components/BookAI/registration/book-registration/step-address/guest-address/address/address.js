import classNames from "classnames";
import React from "react";
import { ReactComponent as TrashIcon } from "../assets/delete.svg";
import styles from "../guest-address.module.scss";
import { Switcher } from "./switcher";
import { formatUen, parseBoolean } from "../../../../../../../utils";

export default function Address({
  dict,
  data,
  isSelected,
  theme = "",
  onClick,
  onDelete,
}) {
  const translate = (value) => value;
  const renderData = () => {
    switch (data.type) {
      case "GUEST": {
        const {
          billingCompanyNumber,
          billingOrganization,
          billingSubjectToVAT,
          billingStreet,
          billingPostalCode,
          billingAddress2,
          billingOrderNumber,
        } = data.address;

        return (
          <div className={styles.data}>
            {billingCompanyNumber && (
              <div>{formatUen(billingCompanyNumber)}</div>
            )}
            {billingOrganization && (
              <div>
                <strong>{billingOrganization}</strong>
              </div>
            )}
            <div>
              {billingStreet} - {billingPostalCode}
            </div>
            {billingAddress2 && <div>{billingAddress2}</div>}
            {billingOrderNumber && <div>{billingOrderNumber}</div>}
            <div>
              {parseBoolean(billingSubjectToVAT)
                ? translate("inscription.soumis_tva")
                : translate("inscription.non_soumis_tva")}
            </div>
          </div>
        );
      }
      case "INVOICING": {
        const {
          uen,
          organization,
          vatApply,
          street,
          zip,
          city,
          address2,
          orderNumber,
        } = data.address;

        return (
          <div className={styles.data}>
            {uen && <div>{formatUen(uen)}</div>}
            {organization && (
              <div>
                <strong>{organization}</strong>
              </div>
            )}
            <div>
              {street} - {zip} {city}
            </div>
            <div>
              {address2 && <div>{address2}</div>}
              {orderNumber && <div>{orderNumber}</div>}
              {vatApply === "1"
                ? translate("inscription.soumis_tva")
                : translate("inscription.non_soumis_tva")}
            </div>
          </div>
        );
      }
      case "ADDRESS": {
        const { fullName: fullname, street, zipCode, city } = data.address;

        return (
          <div className={styles.data}>
            {fullname && (
              <div>
                <strong>{fullname}</strong>
              </div>
            )}
            <div>
              {street} - {zipCode} {city}
            </div>
          </div>
        );
      }
      default:
        return null;
    }

    return null;
  };
  return (
    <div
      className={classNames(
        styles.address,
        isSelected && styles.active,
        styles[theme]
      )}
    >
      <div className="grid-x">
        <div className="cell small-10">{renderData()}</div>
        <div className="cell small-2">
          <div
            className={classNames(
              styles.switchWrapper,
              "align-right flex-container"
            )}
          >
            <Switcher
              theme={theme}
              checked={isSelected === true}
              onChange={() => onClick?.()}
            />
          </div>
        </div>
        <div className="cell small-12">
          {onDelete && (
            <div
              className={classNames(
                styles.actions,
                "flex-container align-right"
              )}
            >
              <TrashIcon
                onClick={() => {
                  console.log("delete");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
