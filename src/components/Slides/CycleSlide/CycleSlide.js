import React from "react";
import Slide from "../Common/Slide/Slide";
import { getByLanguage, prepareS3ResourceUrl } from "../../../utils";
import { getCycleSlideConfig } from "./services";
import {
  formatDateFromTo,
  formatDecimalHours,
  getCycleLabels,
  getCyclePrice,
  getMasterChaineUrl,
  getOfffcourseUrl,
  totalCycleTrainingHours,
} from "../../../utils/event";
import { I18N } from "../../../i18n";
import styles from "./CycleSlide.module.scss";
import Price from "../Common/Price/Price";
import ActionButton from "../Common/ActionButton/ActionButton";
import IconCalendar from "../../Icons/IconCalendar2";
import { Fetching } from "../Common/Slide/Fetching";
import classNames from "classnames";
import { useResponsive } from "../../../common/hooks/useResponsive";

export const CycleSlide = ({
  cycle,
  language,
  env,
  isFetching,
  isUserMember,
  isUserPremium,
  queryParams = {},
  isSmall = false,
  focusTitle,
  isMasterChaine,
  Link = "a",
}) => {
  const { isMobile } = useResponsive();

  if (isFetching) {
    return <Fetching />;
  }

  const {
    clientData,
    startDateTime,
    endDateTime,
    "user-registered": userRegistered,
  } = cycle;

  const { secondaryBanner, theme } = getCycleSlideConfig(cycle, language);

  const name = getByLanguage(cycle, "name", language);

  const s3FolderUrl = `http://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;
  const bannerUrl = getByLanguage(cycle, "pictureUrl", language) ?? "";
  const bannerSrc = prepareS3ResourceUrl(s3FolderUrl, bannerUrl);

  const clientImg = clientData?.avatarUrl;

  const dateFromTo = formatDateFromTo(startDateTime, endDateTime, language);

  const { memberPrice, nonMemberPrice } = getCyclePrice(cycle);
  const { originalPrice } = isUserMember ? memberPrice : nonMemberPrice;

  const isPremiumIncludedCycle = +cycle.client === 9;
  const isUserRegistered =
    userRegistered || (isPremiumIncludedCycle && isUserPremium);

  const cycleCertifiedTrainingHours = totalCycleTrainingHours(cycle);
  const cycleTrainingHours = formatDecimalHours(cycleCertifiedTrainingHours);
  const trainingsCount = cycle.eventCycles?.length;

  const offfcourseUrl = getOfffcourseUrl(env);
  const offfcourseParams = new URLSearchParams(queryParams).toString();
  const masterChaineUrl = getMasterChaineUrl(env);
  const cycleReceptionUrl = !isMasterChaine
    ? `${offfcourseUrl}/cycle/${cycle.id}/reception?${offfcourseParams}`
    : `${masterChaineUrl}/${language}/cycles/${cycle.id}/reception`;
  const cycleProgramUrl = !isMasterChaine
    ? `${offfcourseUrl}/cycle/${cycle.id}/events?${offfcourseParams}`
    : `${masterChaineUrl}/${language}/cycles/${cycle.id}/events`;

  const { cycleLabel, buyCycleLabel } = getCycleLabels(cycle, language);

  const renderCycleDetails = () => {
    return (
      <ul>
        <li>
          <div>
            <IconCalendar className={classNames(styles.icon, "m-r-xs")} />
          </div>
          <span>
            <strong className="tc">
              {I18N[language].inLive} {" : "}
            </strong>
            {dateFromTo}
          </span>
        </li>
      </ul>
    );
  };

  if (!focusTitle) {
    return (
      <Slide
        bannerSrc={bannerSrc || secondaryBanner}
        className={styles.cycleSlide}
        isSmall={isSmall}
        flag={isPremiumIncludedCycle ? "premium" : undefined}
        language={language}
      >
        <Slide.Header
          title={name}
          label={cycleLabel}
          theme={theme}
          clientImg={clientImg}
          link={cycleReceptionUrl}
          isSmall={isSmall}
          type="CYCLE"
          Link={Link}
        >
          <div className={styles.counts}>
            <span className={styles.info}>
              {trainingsCount} {I18N[language].trainings}
            </span>
            <span className={styles.info}>
              {cycleTrainingHours} {I18N[language].ofCertifiedAttestations}
            </span>
          </div>
        </Slide.Header>
        <Slide.Body>{renderCycleDetails()}</Slide.Body>
        <Slide.Footer className={styles.footer}>
          <Price
            price={isUserMember ? memberPrice.price : nonMemberPrice.price}
            memberPrice={memberPrice.price}
            nonMemberPrice={nonMemberPrice.price}
            originalPrice={nonMemberPrice.price}
            isUserMember={isUserMember}
            language={language}
            isSmall={isSmall}
          />
          <div className={styles.actions}>
            <ActionButton
              link={cycleReceptionUrl}
              isSmall={isSmall}
              Link={Link}
              {...(isUserRegistered
                ? { name: I18N[language].moreDetails, theme: "default" }
                : {
                    name:
                      !isSmall && !isMobile
                        ? buyCycleLabel
                        : I18N[language].buy,
                    theme: "greenTeal",
                  })}
            />
            <ActionButton
              name={I18N[language].program}
              link={cycleProgramUrl}
              isSmall={isSmall}
              Link={Link}
            />
          </div>
        </Slide.Footer>
      </Slide>
    );
  }

  return (
    <div className={styles.wrapper}>
      <span className={classNames(styles.title, styles[theme])}>
        {focusTitle}
      </span>
      <div className={styles.slideBlock}>
        <Slide
          bannerSrc={bannerSrc || secondaryBanner}
          className={styles.cycleSlide}
          isSmall={isSmall}
        >
          <Slide.Header
            title={name}
            label={cycleLabel}
            theme={theme}
            clientImg={clientImg}
            link={cycleReceptionUrl}
            isSmall={isSmall}
            type="CYCLE"
            Link={Link}
          >
            <div className={styles.counts}>
              <span className={styles.info}>
                {trainingsCount} {I18N[language].trainings}
              </span>
              <span className={styles.info}>
                {cycleTrainingHours} {I18N[language].ofCertifiedAttestations}
              </span>
            </div>
          </Slide.Header>
          <Slide.Body>{renderCycleDetails()}</Slide.Body>
          <Slide.Footer className={styles.footer}>
            <Price
              price={isUserMember ? memberPrice.price : nonMemberPrice.price}
              memberPrice={memberPrice.price}
              nonMemberPrice={nonMemberPrice.price}
              originalPrice={nonMemberPrice.price}
              isUserMember={isUserMember}
              language={language}
              isSmall={isSmall}
            />
            <div className={styles.actions}>
              <ActionButton
                link={cycleReceptionUrl}
                isSmall={isSmall}
                Link={Link}
                {...(isUserRegistered
                  ? { name: I18N[language].moreDetails, theme: "default" }
                  : {
                      name: !isSmall ? buyCycleLabel : I18N[language].buy,
                      theme: "greenTeal",
                    })}
              />
              <ActionButton
                name={I18N[language].program}
                link={cycleProgramUrl}
                isSmall={isSmall}
                Link={Link}
              />
            </div>
          </Slide.Footer>
        </Slide>
      </div>
    </div>
  );
};
