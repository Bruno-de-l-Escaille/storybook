import React from "react";
import { I18N } from "../../../../i18n";
import cn from "classnames";
import styles from "./Price.module.scss";

export default function Price({
  price,
  language,
  memberPrice,
  isUserMember,
  memberOrg = "OECCBB.",
  originalPrice,
  className,
}) {
  return (
    <div className={cn(styles.price_container, className)}>
      {Boolean(originalPrice) && originalPrice !== price && (
        <div className={styles.original_price}>{originalPrice}</div>
      )}
      <div className={styles.price}>
        {price ? (
          <>
            {price} <span>€</span>
          </>
        ) : (
          <>{I18N[language].free}</>
        )}
      </div>
      {!isUserMember && Boolean(price) && memberPrice !== price && (
        <div className={styles.member_discount}>
          <div className={styles.discount_percent}>{memberPrice} €</div>
          <div className={styles.discount_description}>
            {I18N[language].forTheMembers} {memberOrg}
          </div>
        </div>
      )}
    </div>
  );
}
