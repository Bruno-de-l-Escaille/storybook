import cn from "classnames";
import moment from "moment";
import React, { useState } from "react";
// import { Address } from "./address";
import { ReactComponent as ArrowRightIcon } from "./assets/arrow-right.svg";
import styles from "./guest-address.module.scss";
import { AddAddress } from "./add-address";
import { Address } from "./address";
import { I18N } from "../../../../../i18n";
import { getGuestAddressFromInvoiceAddress } from "../services";
// import { getGuestAddressFromInvoiceAddress } from "../services";
// import { deleteAddress } from "@/api/guest/api";
// import BinIcon from "@/common/assets/bin.svg";
// import { LayoutTheme } from "@/common/constants/themes";
// import { useToken } from "@/common/hooks/use-token";
// import { useTranslate } from "@/common/hooks/use-translate";

// import { Address as AddressType } from "@/common/types/invoicing/interfaces";
// import { useAuth } from "@/contexts/auth/use-auth";
// import { ActionType } from "@/contexts/dialog/action/types";
// import { useActionDialog } from "@/contexts/dialog/action/use-action-dialog";
// import { useGuest } from "@/contexts/guest/use-guest";

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

  // const handleDelete = (address) => {
  //   // openActionDialog({
  //   //   onAsyncAction: () =>
  //   //     deleteAddress({ token, userId: user?.id ?? 0, signature: address.signature }).then(
  //   //       ({ data }) => {
  //   //         const updatedGuest = { ...guest, invoicingData: data } as Guest;
  //   //         setGuest(updatedGuest);
  //   //         setInvoicing?.(data);
  //   //       },
  //   //     ),
  //   //   message: translate('inscription.reallyWantDeleteAddress'),
  //   //   title: translate('inscription.confirmDelete'),
  //   //   type: ActionType.DELETE,
  //   //   icon: <BinIcon />,
  //   // });
  // };

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
              // onSelectAddress?.(newAddress);
              handleToggleForm(false);
            }}
            onCancel={() => handleToggleForm(false)}
            token={token}
            lng="fr"
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
