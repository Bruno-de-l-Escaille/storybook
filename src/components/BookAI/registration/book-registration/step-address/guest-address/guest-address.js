import cn from "classnames";
import moment from "moment";
import React, { useState } from "react";
import { ReactComponent as ArrowRightIcon } from "./assets/arrow-right.svg";
import styles from "./guest-address.module.scss";
import { AddAddress } from "./add-address";
import { Address } from "./address";
import { I18N } from "../../../../../../i18n";
import { getGuestAddressFromInvoiceAddress } from "../services";

export function GuestAddress({
  dict,
  theme,
  invoicings,
  billingSignature,
  defaultUen,
  defaultOpenForm,
  titleClassName,
  title,
  horizontalInputs,
  onSelectAddress,
  onOpenForm,
  setInvoicing,
  token,
  user,
  language = "fr",
  env,
  isPeppolActive,
}) {
  const translate = (text) => {
    return I18N[language][text];
  };

  const { guest, setGuest } = useState(null);
  // const { openActionDialog } = useActionDialog();
  const [manualAddresses, setManualAddresses] = useState([]);
  const [showForm, toggleShowForm] = useState(defaultOpenForm);
  const allAddresses = [...invoicings, ...manualAddresses];
  const showSwitcher = allAddresses.length > 0;

  const handleToggleForm = (value) => {
    toggleShowForm(value);
    // onOpenForm?.(value);
  };

  const isShowForm = showForm || allAddresses.length === 0;

  return (
    <div className={styles.guestAddress}>
      <div className={styles.header}>
        <div className={cn(styles.title, titleClassName)}>
          {title ?? translate("billingData")} :
        </div>
        {showSwitcher && (
          <span
            className={styles.navTo}
            onClick={() => {
              handleToggleForm(!showForm);
            }}
          >
            <span>
              {isShowForm
                ? translate("existingAddresses")
                : translate("newAddress")}
            </span>
            <ArrowRightIcon
              className="m-l-xs"
              width={12}
              height={12}
              fill="#6D7F92"
              viewBox="0 0 16 16"
            />
          </span>
        )}
      </div>
      <div style={{ marginTop: "8px" }}>
        {isShowForm ? (
          <AddAddress
            // dict={dict}
            theme={"blue"}
            horizontalInputs={horizontalInputs}
            defaultUen={defaultUen ?? ""}
            onSubmit={(data) => {
              const date = moment().format();
              const newAddress = {
                ...data,
                billingSignature: date,
              };

              setManualAddresses((address) => [newAddress, ...address]);
              onSelectAddress(newAddress);
              handleToggleForm(false);
            }}
            onCancel={() => handleToggleForm(false)}
            token={token}
            lng="fr"
            env={env}
          />
        ) : (
          [
            manualAddresses.map((address, index) => (
              <div className="m-b-s" key={`address-${index}`}>
                <Address
                  dict={dict}
                  theme={theme}
                  data={{ type: "GUEST", address }}
                  onClick={() => onSelectAddress?.(address)}
                  isSelected={billingSignature === address.billingSignature}
                  language={language}
                  env={env}
                  isPeppolActive={isPeppolActive}
                  token={token}
                  onChange={(newAddress) => {
                    if (newAddress.type === "GUEST") {
                      const updatedAddresses = manualAddresses.map(
                        (addr, idx) =>
                          idx === index ? newAddress.address : addr
                      );
                      setManualAddresses(updatedAddresses);
                      if (billingSignature === address.billingSignature) {
                        onSelectAddress(newAddress.address);
                      }
                    }
                  }}
                />
              </div>
            )),
            invoicings.map((address, index) => (
              <div className="m-b-s" key={`${address.signature}-${index}`}>
                <Address
                  dict={dict}
                  theme={theme}
                  data={{ type: "INVOICING", address }}
                  onClick={() =>
                    onSelectAddress?.(
                      getGuestAddressFromInvoiceAddress(address)
                    )
                  }
                  isSelected={billingSignature === address.signature}
                  // onDelete={() => handleDelete(address)}
                  language={language}
                  env={env}
                  isPeppolActive={isPeppolActive}
                  token={token}
                  onChange={(newAddress) => {
                    if (newAddress.type === "INVOICING") {
                      const updatedInvoicings = invoicings.map((inv) =>
                        inv.signature === address.signature
                          ? newAddress.address
                          : inv
                      );
                      setInvoicing(updatedInvoicings);
                      if (billingSignature === address.signature) {
                        onSelectAddress(
                          getGuestAddressFromInvoiceAddress(newAddress.address)
                        );
                      }
                    }
                  }}
                />
              </div>
            )),
          ]
        )}
      </div>
    </div>
  );
}

export default GuestAddress;
