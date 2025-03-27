import React, { useState } from "react";
import styles from "./EventSlide.module.scss";
import Slide from "../Common/Slide/Slide";
import { getEventSideConfig } from "./services";
import { getByLanguage, prepareS3ResourceUrl } from "../../../utils/common";
import {
  formatDateFromTo,
  getMasterChaineUrl,
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
import { EventMask } from "../../Masks/EventMask/EventMask";

export const EventSlide = ({
  event,
  language,
  env,
  isUserMember,
  isUserPremium,
  isFetching,
  queryParams = {},
  isSmall = false,
  focusTitle,
  isMasterChaine,
  Link = "a",
  isAdmin,
  isOFFFcourse,
  token,
}) => {
  const [hovered, setHovered] = useState(false);
  const [showAddTags, setShowAddTags] = useState(false);
  const [showFocusConfig, setShowFocusConfig] = useState(false);
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
    isVirtual,
  } = event;

  const isFull = isEventFull(event);
  const isFree = isFreeEvent(event);
  const isLive = isEventLive(event);

  const showProgram = isEventStageOpen(event, "showProgram");

  const { label, secondaryBanner } = getEventSideConfig(event, language);
  const showPrice = !isFull;
  const showBrowseButton = isFull && showProgram;
  const showOrateurs = !isFull ? true : showProgram;
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
  const masterChaineUrl = getMasterChaineUrl(env);
  const bannerUrl = getByLanguage(event, "urlBanner", language) ?? "";
  const bannerSrc = prepareS3ResourceUrl(s3FolderUrl, bannerUrl);

  const eventReceptionUrl = !isMasterChaine
    ? `${offfcourseUrl}/${language}/event/${event.id}/reception?${offfcourseParams}`
    : `${masterChaineUrl}/${language}/events/${event.id}/reception`;
  const eventSessionUrl = !isMasterChaine
    ? `${offfcourseUrl}/${language}/event/${event.id}/session?${offfcourseParams}`
    : `${masterChaineUrl}/${language}/events/${event.id}/session`;

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
      <div
        className={styles.wrapper}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-id={event.id}
      >
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
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          data-id={event.id}
        >
          <Slide.Header
            label={label}
            title={name}
            clientImg={clientImg}
            link={eventReceptionUrl}
            type="FORMATION"
            isSmall={isSmall}
            showLiveBadge={showLiveBadge}
            showTimeCounter={showTimeCounter}
            language={language}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            Link={Link}
            isVirtual={isVirtual}
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
                isSmall={isSmall}
                Link={Link}
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
                  isSmall={isSmall}
                  Link={Link}
                />
              )}
            </div>
          </Slide.Footer>
        </Slide>
        {isAdmin && isOFFFcourse && (
          <EventMask
            event={event}
            language={language}
            token={token}
            env={env}
            isHovered={hovered}
            style={{ borderRadius: "14px" }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-id={event.id}
    >
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
            type="FORMATION"
            isSmall={isSmall}
            Link={Link}
            isVirtual={isVirtual}
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
                isSmall={isSmall}
                Link={Link}
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
                  isSmall={isSmall}
                  Link={Link}
                />
              )}
            </div>
          </Slide.Footer>
        </Slide>
      </div>
      {isAdmin && isOFFFcourse && (
        <EventMask
          event={event}
          language={language}
          token={token}
          env={env}
          isHovered={hovered}
          style={{ borderRadius: "14px" }}
        />
      )}
    </div>
  );
};
