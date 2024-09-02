import React from "react";
import styles from "./EventSlide.module.scss";
import Slide from "../Common/Slide/Slide";
import { getEventSideConfig } from "./services";
import { getByLanguage, prepareS3ResourceUrl } from "../../../utils/common";
import { Speakers } from "../Common/Speakers/Speakers";
import {
  formatDateFromTo,
  getOfffcourseUrl,
  isEventFull,
  isEventPast,
  isEventReplayable,
  isFreeEvent,
  isSoldOutEvent,
} from "../../../utils/event";
import { I18N } from "../../../i18n";
import Price from "../Common/Price/Price";
import ActionButton from "../Common/ActionButton/ActionButton";
import IconReplay from "../../../components/Icons/IconReplay";
import IconCalendar from "../../../components/Icons/IconCalendar2";
import { Fetching } from "../Common/Slide/Fetching";

export const EventSlide = ({
  event,
  language,
  env,
  isUserMember,
  isUserPremium,
  isFetching,
  queryParams = {},
}) => {
  if (isFetching) {
    return <Fetching />;
  }

  const {
    clientData,
    "speakers-abstract": speakersData,
    "user-registered": userRegistered,
    startDateTime,
    endDateTime,
    memberPrice,
    nonMemberPrice,
  } = event;

  const isFull = isEventFull(event);
  const isFree = isFreeEvent(event);

  const { label, secondaryBanner } = getEventSideConfig(event, language);
  const showPrice = !isFull;
  const showBrowseButton = isFull;

  const name = getByLanguage(event, "name", language);
  const clientImg = clientData?.avatarUrl;
  const speakers = speakersData?.speakers;

  const s3FolderUrl = `http://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;
  const offfcourseUrl = getOfffcourseUrl(env);
  const offfcourseParams = new URLSearchParams(queryParams).toString();
  const bannerUrl = getByLanguage(event, "urlBanner", language) ?? "";
  const bannerSrc = prepareS3ResourceUrl(s3FolderUrl, bannerUrl);

  const eventReceptionUrl = `${offfcourseUrl}/${language}/event/${event.id}/reception?${offfcourseParams}`;
  const eventSessionUrl = `${offfcourseUrl}/${language}/event/${event.id}/session?${offfcourseParams}`;

  const isSoldOut = isSoldOutEvent(event);
  const isUserRegistered =
    userRegistered || (isUserPremium && Boolean(event.isIncludedPremium));

  const registerBtnTxt =
    isFree || isFull ? I18N[language].registerNow : I18N[language].buyTraining;

  // **** renders ****

  const renderEventMode = () => {
    const { isVirtual, eventPlace } = event;

    const isWebinar = isVirtual && !eventPlace;
    const isOnSite = !isVirtual;

    const isPast = isEventPast(event);
    const isReplayable = isEventReplayable(event);

    if (isPast) {
      if (!isReplayable) {
        return null;
      }

      return (
        <li>
          <div>
            <IconReplay className="m-r-xs" width={16} height={16} />
          </div>
          <strong>{I18N[language].inReplay}</strong>
        </li>
      );
    }

    const modeLabel = isWebinar
      ? I18N[language].inLive
      : isOnSite
      ? I18N[language].presential
      : I18N[language].hybrid;

    return (
      <li>
        <div>
          <IconCalendar className="m-r-xs" width={16} height={16} />
        </div>
        <strong>
          {modeLabel} {" : "}
        </strong>
        {formatDateFromTo(startDateTime, endDateTime, language)}
      </li>
    );
  };

  return (
    <Slide
      bannerSrc={bannerSrc || secondaryBanner}
      className={styles.eventSlide}
      isFetching={isFetching}
    >
      <Slide.Header
        label={label}
        title={name}
        clientImg={clientImg}
        link={eventReceptionUrl}
      />
      <Slide.Body className={styles.slideBody}>
        <Speakers speakers={speakers} className={styles.speakers} />
        <ul className={styles.details}>{renderEventMode()}</ul>
      </Slide.Body>
      <Slide.Footer className={styles.slideFooter}>
        {showPrice && (
          <Price
            price={isUserMember ? memberPrice : nonMemberPrice}
            originalPrice={nonMemberPrice}
            memberPrice={memberPrice}
            isUserMember={isUserMember}
            language={language}
          />
        )}
        <ActionButton
          link={eventReceptionUrl}
          {...(isSoldOut || isUserRegistered
            ? { name: I18N[language].moreDetails, theme: "default" }
            : { name: registerBtnTxt, theme: "greenTeal" })}
        />
        {showBrowseButton && (
          <ActionButton
            name={I18N[language].program}
            link={eventSessionUrl}
            theme="default"
          />
        )}
      </Slide.Footer>
    </Slide>
  );
};
