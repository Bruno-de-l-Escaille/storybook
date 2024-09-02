import React from "react";
import Slide from "../Common/Slide/Slide";
import { getByLanguage, prepareS3ResourceUrl } from "../../../utils";
import { getCycleSlideConfig } from "./services";
import {
  formatDateFromTo,
  formatDecimalHours,
  getCycleLabels,
  getCyclePrice,
  getOfffcourseUrl,
  totalCycleTrainingHours,
} from "../../../utils/event";
import { I18N } from "../../../i18n";
import styles from "./CycleSlide.module.scss";
import Price from "../Common/Price/Price";
import ActionButton from "../Common/ActionButton/ActionButton";
import IconCalendar from "../../Icons/IconCalendar2";
import { Fetching } from "../Common/Slide/Fetching";

export const CycleSlide = ({
  cycle,
  language,
  env,
  isFetching,
  isUserMember,
  isUserPremium,
  queryParams = {},
}) => {
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
  const cycleReceptionUrl = `${offfcourseUrl}/cycle/${cycle.id}/reception?${offfcourseParams}`;
  const cycleProgramUrl = `${offfcourseUrl}/cycle/${cycle.id}/events?${offfcourseParams}`;

  const { cycleLabel, buyCycleLabel } = getCycleLabels(cycle, language);

  const renderCycleDetails = () => {
    return (
      <ul>
        <li>
          <div>
            <IconCalendar className="m-r-xs" />
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

  return (
    <Slide
      bannerSrc={bannerSrc || secondaryBanner}
      className={styles.cycleSlide}
    >
      <Slide.Header
        title={name}
        label={cycleLabel}
        theme={theme}
        clientImg={clientImg}
        link={cycleReceptionUrl}
      >
        <span className={styles.info}>
          {trainingsCount} {I18N[language].trainings}
        </span>
        <span className={styles.info}>
          {cycleTrainingHours} {I18N[language].ofCertifiedAttestations}
        </span>
      </Slide.Header>
      <Slide.Body>{renderCycleDetails()}</Slide.Body>
      <Slide.Footer className={styles.footer}>
        <Price
          price={isUserMember ? memberPrice.price : nonMemberPrice.price}
          memberPrice={memberPrice.price}
          originalPrice={originalPrice ?? 0}
          isUserMember={isUserMember}
          language={language}
        />
        <ActionButton
          link={cycleReceptionUrl}
          {...(isUserRegistered
            ? { name: I18N[language].moreDetails, theme: "default" }
            : { name: buyCycleLabel, theme: "greenTeal" })}
        />
        <ActionButton name={I18N[language].program} link={cycleProgramUrl} />
      </Slide.Footer>
    </Slide>
  );
};
