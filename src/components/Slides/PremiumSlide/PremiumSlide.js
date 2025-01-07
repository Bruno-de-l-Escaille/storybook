import React from "react";
import Slide from "../Common/Slide/Slide";
import { I18N } from "../../../i18n";
import styles from "./PremiumSlide.module.scss";
import ActionButton from "../Common/ActionButton/ActionButton";
import { Fetching } from "../Common/Slide/Fetching";
import CheckMark from "../../Icons/CheckMarkv2";
import cn from "classnames";
import { getOfffcourseUrl } from "../../../utils/event";
import { useResponsive } from "../../../common/hooks/useResponsive";

export const PremiumSlide = ({
  cycle,
  language,
  isUserMember,
  env,
  isFetching,
  queryParams = {},
}) => {
  const { isMobile, isDesktop } = useResponsive();
  if (isFetching) {
    return <Fetching />;
  }
  const { "user-registered": userRegistered } = cycle;
  const isUserPremium = userRegistered;

  const offfcourseUrl = getOfffcourseUrl(env);
  const offfcourseParams = new URLSearchParams(queryParams).toString();
  const cycleReceptionUrl = `${offfcourseUrl}/cycle/${cycle.id}/reception?${offfcourseParams}`;

  const renderPlans = () => {
    const yearlyPrice = isUserMember ? cycle.memberPrice : cycle.nonMemberPrice;
    const monthlyPrice = isUserMember
      ? cycle.monthlyMemberPrice
      : cycle.monthlyNonMemberPrice;

    const savingPercent = Math.floor(
      ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100
    );

    return (
      <div className={styles.plans}>
        <div className={styles.plan}>
          <span className={styles.label}>{I18N[language].monthly}</span>
          <div className={styles.price}>
            <span className={styles.amount}>{monthlyPrice}</span>
            <span className={styles.currency}>€</span>
            <span className={styles.period}>/{I18N[language].month}</span>
          </div>
        </div>
        <div className={styles.plan}>
          <div className={styles.titleContainer}>
            <span className={styles.label}>{I18N[language].yearly}</span>
            {isMobile && (
              <span className={styles.originalPrice}>{monthlyPrice * 12}</span>
            )}
          </div>
          <div className={styles.price}>
            <span className={styles.amount}>
              {yearlyPrice} <span className={styles.currency}>€</span>
            </span>
            {!isMobile && (
              <span className={styles.originalPrice}>{monthlyPrice * 12}</span>
            )}
            <span className={styles.period}>/{I18N[language].year}</span>
          </div>
          <div className={styles.oeccbbAdvantage}>
            <span>{I18N[language].oeccbbAdvantage1}</span>
            <span>{I18N[language].oeccbbAdvantage2}</span>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Slide
      bannerSrc="/img/slides/premium-banner.png"
      className={styles.premiumSlide}
    >
      <Slide.Header
        label={I18N[language].premiumSubscription}
        theme="redOrange"
        title={I18N[language].premiumDescription}
        link={cycleReceptionUrl}
        titleStyle={{
          height: isDesktop ? "80px" : "auto",
          maxHeight: isDesktop ? "80px" : "none",
        }}
      />
      <Slide.Body className={styles.body}>
        <div className={styles.note}>{I18N[language].premiumLabel}</div>
        {renderPlans()}
      </Slide.Body>
      <Slide.Footer className={styles.footer}>
        {!isUserPremium ? (
          <ActionButton
            name={I18N[language].subscribeToPremium}
            theme="redOrange"
            link={cycleReceptionUrl}
          />
        ) : (
          <div className={cn(styles.subscribed)}>
            <CheckMark
              width="10"
              height="10"
              fill="#02AF8E"
              className="m-r-xs"
            />
            {I18N[language].subscribed}
          </div>
        )}
        <div className={styles.premiumAllCourses}>
          <span>{I18N[language].containsExclusiveEvents}</span>
        </div>
      </Slide.Footer>
    </Slide>
  );
};
