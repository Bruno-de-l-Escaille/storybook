import classNames from "classnames";
import React from "react";
import styles from "./books-purchase-summary.module.scss";
import summaryStyles from "./books-purchase-summary.module.scss";

import { I18N } from "../../../../i18n";
import { PersonalData } from "./personal-data";
import BillingAddressStep from "./billing-address-step/BillingAddressStep";

export default function BookPurchaseSummary({
  invoiceAddress,
  product,
  user,
  language,
}) {
  const translate = (text) => {
    return I18N[language][text];
  };
  const userInscriptionState = {
    id: user?.id ?? 0,
    userId: user?.id ?? 0,
    uid: user?.uid ?? "",
    firstName: user?.firstName,
    lastName: user?.lastName,
    mainEmail: user?.mainEmail ?? "",
    language: (user?.language ?? "").toLowerCase(),
    gender: user?.gender,
    mainPhone: user?.mainPhone ?? "",
    organization: user?.organization ?? "",
  };
  // const userInscriptionState = parseJson<UserInscriptionState>(guest?.userInscriptionState) ?? null;

  const totalPrice = product.unitPrice;

  return (
    <div
      className={classNames(
        styles.bookPurchaseSummary,
        summaryStyles.wrapper
        // styles[theme]
      )}
    >
      <h3>{translate("summary")}</h3>
      <PersonalData
        userInscriptionState={userInscriptionState}
        language={language}
        user={user}
      />

      {invoiceAddress && (
        <BillingAddressStep
          invoicingData={invoiceAddress}
          language={language}
        />
      )}
      <div className={styles.total}>
        <p>{translate("total_to_pay")} :</p>
        <span>{totalPrice} €</span>
      </div>
    </div>
  );
}
