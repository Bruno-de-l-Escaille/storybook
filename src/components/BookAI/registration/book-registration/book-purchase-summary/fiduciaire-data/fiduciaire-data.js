"use client";

import classNames from "classnames";
import React from "react";
import summaryStyles from "../StepsSummary.module.scss";
import { SummaryBlock } from "../summary-block/SummaryBlock";
import styles from "./fiduciaire-data.module.scss";
import { I18N } from "../../../../../../i18n";
// import EditIcon from '@/common/components/registration/assets/edit.svg';
// import { useLanguage } from '@/common/hooks/use-language';
// import { getByLanguage } from '@/common/services/event/event';
// import { PlaceModel } from '@/common/types/place/interfaces';
// import { getTranslator } from '@/i18n/dictionaries';

function FiduciaireData({ language, fiduciaire, pricingTier }) {
  const translate = (text) => {
    return I18N[language][text];
  };

  const renderTitle = () => (
    <div className={styles.title}>
      <span>{translate("fiduciaries")}</span>
      {/* <EditIcon onClick={handleEditPlaces} /> */}
    </div>
  );
  return (
    <div className={styles.fiduciaire}>
      <SummaryBlock title={renderTitle()} />
      <div className={classNames(summaryStyles.container)}>
        <div className={classNames(styles.fiduciaireContainer)}>
          <div className={styles.fiduciaireName}>{fiduciaire?.name ?? ""}</div>
          <div className={styles.fiduciaireSize}>
            {translate("fiduciaireSize").replace(
              "{{size}}",
              fiduciaire?.organizationSize ?? 1
            )}
          </div>
          <div className={styles.fiduciaireReduction}>
            {translate("fiduciaireReduction")} :{" "}
            {pricingTier ? pricingTier?.discount * 100 ?? 0 : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiduciaireData;
