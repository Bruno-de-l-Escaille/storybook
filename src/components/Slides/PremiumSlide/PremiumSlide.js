import React from "react";
import Slide from "../Common/Slide/Slide";
import { I18N } from "../../../i18n";
import styles from "./PremiumSlide.module.scss";
import ActionButton from "../Common/ActionButton/ActionButton";
import { Fetching } from "../Common/Slide/Fetching";
import CheckMark from "../../Icons/CheckMarkv2";
import cn from "classnames";
import { getOfffcourseUrl } from "../../../utils/event";

export const PremiumSlide = ({
  cycle,
  language,
  isUserMember,
  env,
  isFetching,
  queryParams = {},
}) => {
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
          <p className={styles.description}>
            {I18N[language].twelveMonthsCommitment}
          </p>
        </div>
        <div className={styles.plan}>
          <span className={styles.label}>{I18N[language].yearly}</span>
          <div className={styles.price}>
            <span className={styles.amount}>{yearlyPrice}</span>
            <span className={styles.currency}>€</span>
            <span className={styles.period}>/{I18N[language].year}</span>
          </div>
          <div className={styles.infos}>
            <span className={styles.originalPrice}>{6778}</span>
            <span className={styles.discount}>
              {I18N[language].saveAmount} {savingPercent} %
            </span>
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
      />
      <Slide.Body className={styles.body}>
        <div className={styles.note}>
          {I18N[language].containsExclusiveEvents}
        </div>
        {renderPlans()}
      </Slide.Body>
      <Slide.Footer>
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
      </Slide.Footer>
    </Slide>
  );
};
