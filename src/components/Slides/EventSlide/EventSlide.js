import React from "react";
import styles from "./EventSlide.module.scss";
import Slide from "../Common/Slide/Slide";
import { getEventSideConfig } from "./services";
import { getByLanguage, prepareS3ResourceUrl } from "../../../utils/common";
import {
  formatDateFromTo,
  getOfffcourseUrl,
  getRegisterButtonTitle,
  isEventFull,
  isEventLive,
  isEventPast,
  isEventReplayable,
  isEventStageOpen,
  isFreeEvent,
  isSoldOutEvent,
} from "../../../utils/event";
import { I18N } from "../../../i18n";
import Price from "../Common/Price/Price";
import ActionButton from "../Common/ActionButton/ActionButton";
import IconReplay from "../../../components/Icons/IconReplay";
import IconCalendar from "../../../components/Icons/IconCalendar2";
import { Fetching } from "../Common/Slide/Fetching";
import { SpeakersSlide } from "../Common/SpeakersSlide/SpeakersSlide";
import classNames from "classnames";
import moment from "moment";

export const EventSlide = ({
  event,
  language,
  env,
  isUserMember,
  isUserPremium,
  isFetching,
  queryParams = {},
  onClick,
  isSmall = false,
  focusTitle,
  isOFFFcourse,
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
  const isLive = isEventLive(event);

  const showProgram = isEventStageOpen(event, "showProgram");

  const { label, secondaryBanner } = getEventSideConfig(event, language);
  const showPrice = !isFull;
  const showBrowseButton = isFull && showProgram;
  const showOrateurs = !isFull;
  const showLiveBadge = isLive;

  const showTimeCounter =
    isFull &&
    moment(startDateTime).diff(moment(), "days") < 30 &&
    moment(startDateTime).diff(moment(), "days") > 0;

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

  const registerBtnTxt = getRegisterButtonTitle(event, language);

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
            <IconReplay className={classNames(styles.icon, "m-r-xs")} />
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
          <IconCalendar className={classNames(styles.icon, "m-r-xs")} />
        </div>
        <div>
          <strong>
            {modeLabel} {" : "}
          </strong>
          {formatDateFromTo(startDateTime, endDateTime, language)}
        </div>
      </li>
    );
  };

  if (!focusTitle) {
    return (
      <Slide
        bannerSrc={bannerSrc || secondaryBanner}
        className={styles.eventSlide}
        isFetching={isFetching}
        isSmall={isSmall}
        flag={
          isSoldOut && !isUserRegistered
            ? "sold-out"
            : event.isIncludedPremium === 1
            ? "premium"
            : undefined
        }
        language={language}
      >
        <Slide.Header
          label={label}
          title={name}
          clientImg={clientImg}
          link={eventReceptionUrl}
          id={event.id}
          type="FORMATION"
          pathname={`/event/${event.id}/reception`}
          isSmall={isSmall}
          onClick={onClick}
          isOFFFcourse={isOFFFcourse}
          showLiveBadge={showLiveBadge}
          showTimeCounter={showTimeCounter}
          language={language}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
        />
        <Slide.Body className={styles.slideBody}>
          {showOrateurs && <SpeakersSlide speakers={speakers} />}
          <ul className={styles.details}>{renderEventMode()}</ul>
        </Slide.Body>
        <Slide.Footer className={styles.slideFooter}>
          {showPrice && (
            <Price
              price={isUserMember ? memberPrice : nonMemberPrice}
              originalPrice={nonMemberPrice}
              memberPrice={memberPrice}
              nonMemberPrice={nonMemberPrice}
              isUserMember={isUserMember}
              language={language}
              isSmall={isSmall}
            />
          )}
          <div className={styles.actions}>
            <ActionButton
              link={eventReceptionUrl}
              onClick={onClick}
              id={event.id}
              type="FORMATION"
              pathname={`/event/${event.id}/reception`}
              isSmall={isSmall}
              isOFFFcourse={isOFFFcourse}
              {...(isSoldOut || isUserRegistered
                ? {
                    name: !isSmall
                      ? I18N[language].moreDetails
                      : I18N[language].details,
                    theme: "default",
                  }
                : { name: registerBtnTxt, theme: "greenTeal" })}
            />
            {showBrowseButton && (
              <ActionButton
                name={I18N[language].program}
                link={eventSessionUrl}
                theme="default"
                onClick={onClick}
                id={event.id}
                type="FORMATION"
                pathname={`/event/${event.id}/session`}
                isSmall={isSmall}
                isOFFFcourse={isOFFFcourse}
              />
            )}
          </div>
        </Slide.Footer>
      </Slide>
    );
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>{focusTitle}</span>
      <div className={styles.slideBlock}>
        <Slide
          bannerSrc={bannerSrc || secondaryBanner}
          className={styles.eventSlide}
          isFetching={isFetching}
          isSmall={isSmall}
        >
          <Slide.Header
            label={label}
            title={name}
            clientImg={clientImg}
            link={eventReceptionUrl}
            id={event.id}
            type="FORMATION"
            pathname={`/event/${event.id}/reception`}
            isSmall={isSmall}
            onClick={onClick}
          />
          <Slide.Body className={styles.slideBody}>
            {showOrateurs && <SpeakersSlide speakers={speakers} />}
            <ul
              className={styles.details}
              style={{ fontSize: !isSmall ? "14px" : "12px" }}
            >
              {renderEventMode()}
            </ul>
          </Slide.Body>
          <Slide.Footer className={styles.slideFooter}>
            {showPrice && (
              <Price
                price={isUserMember ? memberPrice : nonMemberPrice}
                originalPrice={nonMemberPrice}
                memberPrice={memberPrice}
                nonMemberPrice={nonMemberPrice}
                isUserMember={isUserMember}
                language={language}
                isSmall={isSmall}
              />
            )}
            <div className={styles.actions}>
              <ActionButton
                link={eventReceptionUrl}
                onClick={onClick}
                id={event.id}
                type="FORMATION"
                pathname={`/event/${event.id}/reception`}
                isSmall={isSmall}
                isOFFFcourse={isOFFFcourse}
                {...(isSoldOut || isUserRegistered
                  ? {
                      name: !isSmall
                        ? I18N[language].moreDetails
                        : I18N[language].details,
                      theme: "default",
                    }
                  : { name: registerBtnTxt, theme: "greenTeal" })}
              />
              {showBrowseButton && (
                <ActionButton
                  name={I18N[language].program}
                  link={eventSessionUrl}
                  theme="default"
                  onClick={onClick}
                  id={event.id}
                  type="FORMATION"
                  pathname={`/event/${event.id}/session`}
                  isSmall={isSmall}
                  isOFFFcourse={isOFFFcourse}
                />
              )}
            </div>
          </Slide.Footer>
        </Slide>
      </div>
    </div>
  );
};
