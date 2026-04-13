"use client";

import React from "react";
import styles from "../StepsSummary.module.scss";
import { SummaryBlock } from "../summary-block/SummaryBlock";
import { I18N } from "../../../../../../i18n";
import { formatUen } from "../../../../../../utils";

function BillingAddressStep({
  invoicingData,
  dict,
  registeredChoice,
  language,
}) {
  const translate = (text) => {
    return I18N[language][text];
  };

  const checkInvoicingData = () => {
    const { billingOrganization, billingStreet, billingPostalCode } =
      invoicingData || {};
    return (
      invoicingData &&
      ![billingOrganization, billingStreet, billingPostalCode].includes("")
    );
  };

  const renderInvoicingData = (data) => (
    <div className={styles.text}>
      {data.billingCompanyNumber && (
        <div>{formatUen(data.billingCompanyNumber)}</div>
      )}
      <div>{data.billingOrganization}</div>
      <div>{`${data.billingStreet} - ${data.billingPostalCode}`}</div>
      {data.billingAddress2 && <div>{data.billingAddress2}</div>}
      {data.billingOrderNumber && <div>{data.billingOrderNumber}</div>}
      <div>
        {data.billingSubjectToVAT
          ? translate("soumis_tva")
          : translate("non_soumis_tva")}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {registeredChoice && <div className={styles.smallBorder} />}
      <SummaryBlock
        title={translate("billing_address")}
        empty={!checkInvoicingData()}
      />
      <div className={styles.container}>
        {checkInvoicingData() && (
          <div>{renderInvoicingData(invoicingData)}</div>
        )}
      </div>
    </div>
  );
}

export default BillingAddressStep;
