import classNames from "classnames";
import React, { useEffect } from "react";
import { ReactComponent as TrashIcon } from "../assets/delete.svg";
import styles from "../guest-address.module.scss";
import { Switcher } from "./switcher";
import {
  formatUen,
  getApiUrl,
  isEmpty,
  parseBoolean,
} from "../../../../../../../utils";
import { useQuery } from "@tanstack/react-query";
import IconCheckmark from "../../../../../../EventLayout/assets/IconCheckmark";
import IconAlertCircle from "../../../../../../../components/Icons/AlertCircle";
import { PulseLoader } from "react-spinners";
import { checkOrganizationExistsInPeppol } from "../../../../../../../api/adress";
import { I18N } from "../../../../../../../i18n";

export default function Address({
  dict,
  data,
  isSelected,
  theme = "",
  isPeppolActive,
  onClick,
  onDelete,
  onChange,
  token,
  language,
  env,
}) {
  const translate = (value) => {
    return I18N[language][value];
  };

  const organizationNumber =
    data.type === "INVOICING"
      ? data.address.uen
      : data.type === "GUEST"
      ? data.address.billingCompanyNumber ?? ""
      : "";

  const {
    data: isPeppolAvailable,
    isFetching: isCheckingPeppolAvailability,
  } = useQuery({
    queryKey: ["checkOrganizationExistsInPeppol", organizationNumber],
    queryFn: async () => {
      let orgNumber = organizationNumber;

      if (isEmpty(orgNumber)) {
        return false;
      }

      if (/^\d/.test(orgNumber)) {
        orgNumber = `BE${orgNumber}`;
      }

      const response = await checkOrganizationExistsInPeppol({
        token,
        organizationNumber: orgNumber,
        apiUrl: getApiUrl(env),
      });

      const isExists = response?.data?.data?.exists ?? false;

      return isExists;
    },
    enabled: isSelected && isPeppolActive,
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (isSelected && !isCheckingPeppolAvailability && !isPeppolAvailable) {
      if (data.type === "INVOICING" && data.address.doNotSendInvoice) {
        onChange({
          ...data,
          address: {
            ...data.address,
            doNotSendInvoice: false,
          },
        });
      } else if (
        data.type === "GUEST" &&
        data.address.billingDoNotSendInvoice
      ) {
        onChange({
          ...data,
          address: {
            ...data.address,
            billingDoNotSendInvoice: false,
          },
        });
      }
    }
  }, [isSelected, isPeppolAvailable, isCheckingPeppolAvailability]);

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
                ? translate("soumis_tva")
                : translate("non_soumis_tva")}
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
                ? translate("soumis_tva")
                : translate("non_soumis_tva")}
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

  const renderBillingOptions = () => {
    if (isCheckingPeppolAvailability) {
      return (
        <div className={styles.billingOptions}>
          <div className={styles.peppolInfo}>
            <PulseLoader size={7} color="var(--color-text)" />
          </div>
        </div>
      );
    }

    const doNotSendInvoice =
      data.type === "GUEST"
        ? parseBoolean(data.address.billingDoNotSendInvoice)
        : data.type === "INVOICING"
        ? parseBoolean(data.address.doNotSendInvoice)
        : false;

    return (
      <div className={styles.billingOptions}>
        <div className={styles.peppolInfo}>
          <span className={styles.infoIcon}>
            <IconAlertCircle width={20} height={20} />
          </span>
          <span className={styles.infoText}>
            {translate(
              isPeppolAvailable
                ? "peppolInvoiceInfoExists"
                : "peppolInvoiceInfoNotExists"
            )}
          </span>
        </div>
        {isPeppolAvailable && (
          <div
            className={classNames(
              styles.peppolCheckbox,
              !doNotSendInvoice && styles.checked
            )}
            onClick={() => {
              if (data.type === "GUEST") {
                const updatedData = {
                  ...data,
                  address: {
                    ...data.address,
                    billingDoNotSendInvoice: !doNotSendInvoice,
                  },
                };
                onChange(updatedData);
              } else if (data.type === "INVOICING") {
                const updatedData = {
                  ...data,
                  address: {
                    ...data.address,
                    doNotSendInvoice: !doNotSendInvoice,
                  },
                };
                onChange(updatedData);
              }
            }}
          >
            <span className={styles.checkboxIcon}>
              <IconCheckmark />
            </span>
            <span className={styles.checkboxText}>
              {translate("peppolEmailOption")}
            </span>
          </div>
        )}
      </div>
    );
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
        {Boolean(isPeppolActive && isSelected) && (
          <div className="cell small-12">{renderBillingOptions()}</div>
        )}
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
