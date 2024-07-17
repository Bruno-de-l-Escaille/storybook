import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  capFirstLetterInSentence,
  getApiUrl,
  getByLanguage,
  getCroppedImageUrl,
  isEmpty,
  onError,
  parseBoolean,
  prepareS3ResourceUrl,
  stopPropagation,
} from "../../utils/common";
import {
  calculatePlayProgressTime,
  calculateTimeDifference,
  formatDateEndOfReplay,
  formatDateFromTo,
  getEventNbMinutes,
  getSlotReplayUrl,
  isEventFull,
  isEventLive,
  isEventPast,
  isEventRegistrationOpen,
  isEventReplayable,
  isEventUpcoming,
  isFreeEvent,
  isRegistrationActive,
  isReplayExpiredForUser,
  isSoldOutEvent,
  isWebinarEvent,
  playProgressTime,
} from "../../utils/event";
import moment from "moment";
import { Button } from "../../common/components/OfffcourseButton";
import classNames from "classnames";
import { I18N } from "../../i18n";
import FilledPlayIcon from "./assets/filled-play.svg";
import FilledResumeIcon from "./assets/filled-resume.svg";
import { ClipLoader } from "react-spinners";
import LiveTrainingIcon from "./assets/live-training.svg";
import CheckMarkIcon from "./assets/checkmark.svg";
import { ProgressBar } from "../../common/components/ProgressBar";
import styles from "./EventLayout.module.scss";
import PlayIcon from "./assets/play.svg";
import EarthIcon from "./assets/earth.svg";
import CalendarIcon from "./assets/calendar.svg";
import NewCalendarIcon from "./assets/newCalendar.svg";
import { CardFlag } from "../CardFlag";
import { registerPremiumToEvent } from "../../api/event";
import { Shave } from "../../common/components/Shave";
import { TimeCounter } from "../../common/components/TimeCounter";

const S3_FOLDER_URL = "http://s3.tamtam.pro/production";
const S3_FOLDER_AWS_URL_WITHOUT_ENV =
  "https://tamtam.s3.eu-west-1.amazonaws.com";

export default function EventLayout({
  env,
  language,
  auth,
  Link,
  event,
  price,
  options,
  dateEndOfReplay,
  isActive,
  isRegisteredToPremium,
  isMember,
  receptionPageLink,
  sessionPageLink,
}) {
  const { startDateTime, endDateTime, memberPrice, nonMemberPrice } = event;

  const apiUrl = getApiUrl(env);
  const isExpired = isEventPast(event);
  const isUpcomming = isEventUpcoming(event);
  const isReplayable = isEventReplayable(event);
  const isLive = isEventLive(event);
  const isWebinar = isWebinarEvent(event);
  const isFull = isEventFull(event);
  const isSoldOut = isSoldOutEvent(event);
  const urlBanner = getByLanguage(event, "urlBanner", language) ?? "";
  const banner = getCroppedImageUrl(urlBanner, undefined, 280);
  const bannerImgUrl = !isEmpty(banner)
    ? prepareS3ResourceUrl(S3_FOLDER_URL, banner)
    : `${S3_FOLDER_AWS_URL_WITHOUT_ENV}/image_2024_01_08T20_38_38_750Z.png`;
  const name = getByLanguage(event, "name", language) ?? "";
  const { hours: eventHoursDiffWithNow } = calculateTimeDifference(
    event.startDateTime
  );
  const eventTime = getEventNbMinutes(event);
  const isFullWatch = event?.fullWatch ?? 0;
  const playProgress = playProgressTime(
    event?.playProgress,
    eventTime,
    isFullWatch
  );
  const EventPlayProgress = calculatePlayProgressTime(
    eventTime,
    event?.playProgress,
    isFullWatch
  );
  const watchedTime = event?.playProgress ?? 0;
  const targetDate = moment(event.startDateTime);
  const currentDate = moment();
  const targetDateWithoutTime = moment(targetDate).startOf("day");
  const currentDateWithoutTime = moment(currentDate).startOf("day");
  const showTimeCounter =
    targetDateWithoutTime.isSame(currentDateWithoutTime) &&
    eventHoursDiffWithNow !== null &&
    eventHoursDiffWithNow <= 24 &&
    isUpcomming;
  const eventDateEndOfReplay = formatDateEndOfReplay(
    event.dateEndOfReplay,
    event.endDateTime
  );
  const eventDateEndOfReplayYear =
    (eventDateEndOfReplay !== "" &&
      eventDateEndOfReplay?.match(/\d{4}/)?.[0]) ??
    null;
  const dateEndOfReplayYear =
    (dateEndOfReplay !== "" && dateEndOfReplay?.match(/\d{4}/)?.[0]) ?? null;
  const place =
    getByLanguage(event.eventPlace, "place", language) || !event.isVirtual;
  const dateHelper = formatDateFromTo(
    startDateTime ?? "",
    endDateTime ?? "",
    language
  );
  const isAdmin = auth.loggedAs === "ADMIN";
  const isFree = isFreeEvent(event);
  const isRegistrationOpen = isFull
    ? isRegistrationActive(event, isAdmin)
    : isEventRegistrationOpen(event);
  const [registeringPremium, setRegisteringPremium] = useState(false);
  const eventLink = isEventFull ? sessionPageLink : receptionPageLink;

  const nbMinutes = getEventNbMinutes(event);

  const handleRegisterPremium = useCallback(
    (e) => {
      e.preventDefault();
      const eventId = event.id;

      setRegisteringPremium(true);
      registerPremiumToEvent({
        apiUrl,
        token: auth.token,
        eventId,
        userId: auth.id,
      })
        .finally(() => {
          setRegisteringPremium(false);
        })
        .then(() => {
          event["user-registered"] = true;
          if (+event.slotsCount === 1 && event.slotReplayUrls) {
            const replayLink = getSlotReplayUrl(event.slotReplayUrls, language);
            if (replayLink) {
              window.open(replayLink, "_blank", "noreferrer");
            }
          }
        })
        .catch((e) => onError(language));
    },
    [registeringPremium, auth.id, event, registerPremiumToEvent, onError]
  );

  const renderMainAction = () => {
    if (isActive) {
      if (isExpired) {
        if (+event.replayStatus !== 2 || isReplayExpiredForUser(event)) {
          return (
            <Button
              variant="tertiary"
              textSize="md"
              className={classNames(styles.mainButton, styles.blue)}
            >
              <span style={{ fontSize: "13px", fontWeight: "500" }}>
                {I18N[language]["replayExpired"]}
              </span>
            </Button>
          );
        }

        if (+event.slotsCount === 1 && event.slotReplayUrls) {
          const replayLink =
            getSlotReplayUrl(event.slotReplayUrls, language) +
            (event.selectedDate
              ? `&selectedDate=${event.selectedDate}&eventDate=${event.startDateTime}`
              : "");
          return (
            <Button
              link={event["user-registered"] ? replayLink : ""}
              variant="success"
              textSize="sm"
              className={classNames(
                styles.mainButton,
                "greetings",
                styles.blue
              )}
              target="_blank"
              rel="noopener noreferrer"
              icon={
                !registeringPremium ? (
                  <>
                    {isFullWatch ? (
                      <FilledPlayIcon className="m-r-xxs" />
                    ) : watchedTime > 0 ? (
                      <FilledResumeIcon className="m-r-xxs" />
                    ) : (
                      <FilledPlayIcon className="m-r-xxs" />
                    )}
                  </>
                ) : (
                  <div className="m-r-xxs">
                    <ClipLoader size={12} color="#FFFFFF" />
                  </div>
                )
              }
              onClick={
                isRegisteredToPremium && !event["user-registered"]
                  ? handleRegisterPremium
                  : stopPropagation
              }
            >
              <span style={{ fontSize: "14px" }}>
                {isFullWatch
                  ? I18N[language]["review"]
                  : watchedTime > 0
                  ? I18N[language]["resume"]
                  : I18N[language]["play"]}
              </span>
            </Button>
          );
        }
      }

      if (!isExpired) {
        return (
          <Button
            link={eventLink}
            variant="success"
            textSize="sm"
            className={classNames(
              styles.mainButton,
              "greetings",
              isLive ? styles.red : styles.blue
            )}
            target="_blank"
            rel="noopener noreferrer"
            icon={<LiveTrainingIcon className="m-r-xxxs" />}
          >
            <span style={{ fontSize: "14px" }}>{I18N[language]["rejoin"]}</span>
          </Button>
        );
      }
    }

    const buttonText =
      isRegistrationOpen && !isSoldOut
        ? isUpcomming
          ? I18N[language]["participate"]
          : I18N[language]["buy"]
        : I18N[language]["details"];
    const buttonClassName = classNames(
      styles.mainButton,
      isFull,
      isRegistrationOpen && !isSoldOut && styles.green
    );

    return (
      <Button
        link={eventLink}
        variant="success"
        textSize="md"
        className={buttonClassName}
      >
        <span style={{ fontSize: "14px" }}>{buttonText}</span>
      </Button>
    );
  };

  const renderEventPrice = () => {
    if (options && !options.showPrice) {
      return null;
    }

    if (isFree && !isActive) {
      return (
        <div
          className={classNames(styles.badge, "m-t-xs")}
          style={{ color: "#29394D", fontWeight: "500" }}
        >
          {I18N[language]["free"]}{" "}
        </div>
      );
    }

    if (isActive) {
      return (
        <div className={classNames(styles.subscribed)}>
          <CheckMarkIcon className="m-r-s" />
          <span>{I18N[language]["subscribed"]}</span>
        </div>
      );
    }

    const eventPrice = isMember ? memberPrice : nonMemberPrice;

    if (price && +price < +eventPrice) {
      return (
        <div
          className={styles.badge}
          style={{ display: "flex", alignItems: "center", marginTop: "5px" }}
        >
          <span className={styles.strike} style={{ fontWeight: "500" }}>
            {eventPrice} €
          </span>
          <span
            className="m-l-s"
            style={{ color: "#29394D", fontWeight: "500" }}
          >
            {price} €
          </span>
        </div>
      );
    }

    if (!isFull) {
      return (
        <div
          className={styles.badge}
          style={{ display: "flex", alignItems: "center", marginTop: "5px" }}
        >
          {!isMember && memberPrice !== nonMemberPrice && (
            <span className={classNames("m-r-s", styles.reductionOrg)}>
              <span style={{ fontSize: "16px" }}> {memberPrice} €</span>
              <span> {I18N[language]["forTheMembers"]} OECCBB.</span>
            </span>
          )}
          {isMember && memberPrice !== nonMemberPrice && (
            <span className={styles.strike} style={{ fontWeight: "500" }}>
              {nonMemberPrice} €
            </span>
          )}
          <span
            className="m-l-xs"
            style={{ color: "#29394D", fontWeight: "500", fontSize: "20px" }}
          >
            {eventPrice} <span style={{ fontSize: "12px" }}>€</span>
          </span>
        </div>
      );
    }

    return null;
  };

  const renderPlayProgress = () => {
    if (EventPlayProgress > 0 || (isActive && EventPlayProgress === 0)) {
      return (
        <div>
          <ProgressBar
            progress={EventPlayProgress}
            showProgressNumber={false}
            color="linear-gradient(180deg, #18A0FB 0%, #06D9B1 100%)"
            width="100%"
            height="4px"
            style={{ background: "#B2BCC6" }}
            className={styles.progressBar}
            isEventWatch
          />
        </div>
      );
    }

    return null;
  };

  const renderInReplayTitleWithDesc = () => {
    if (!isReplayable || (options && !options.showReplayInfo)) {
      return null;
    }

    if (isExpired) {
      return (
        <>
          <li style={{ lineHeight: "1.25rem" }}>
            <PlayIcon className="m-r-xs" />
            <span
              style={{
                fontStyle: "normal",
                fontWeight: "bold",
                marginRight: "15px",
              }}
            >
              {capFirstLetterInSentence(I18N[language]["inReplay"])}
            </span>
            <span className={styles.replayDate}>
              {dateEndOfReplayYear || eventDateEndOfReplayYear}
            </span>
          </li>
        </>
      );
    }

    return null;
  };

  return (
    <div
      className={classNames(styles.event, isActive && styles.active)}
      style={{ height: "318px" }}
    >
      <div className="m-b-s">
        <div
          className={classNames(styles.banner)}
          style={{ backgroundImage: `url(${bannerImgUrl})` }}
        >
          {!isEmpty(event.clientData?.avatarUrl) && (
            <div className={styles.logoWrapper}>
              <span
                style={{
                  backgroundImage: `url(${event.clientData?.avatarUrl})`,
                }}
              />
            </div>
          )}
          <CardFlag
            language={language}
            flag={
              isSoldOut && !isActive
                ? "sold-out"
                : parseBoolean(event.isIncludedPremium) && !isActive
                ? "premium"
                : undefined
            }
          />
          {showTimeCounter && (
            <div className={styles.timeCounter}>
              <TimeCounter
                date={event.startDateTime}
                language={language}
                showDays={false}
              />
            </div>
          )}
          {isLive ? (
            <div className={styles.badges}>
              <div className={styles.badge} style={{ background: "#FE3745" }}>
                {I18N[language]["liveNow"].toUpperCase()}
              </div>
              <div className={classNames(styles.badge)}>{nbMinutes} min</div>
            </div>
          ) : isActive && EventPlayProgress === 0 ? (
            <div className={styles.badges}>
              <div className={styles.badge}>{`${0} sur ${eventTime} min`}</div>
            </div>
          ) : !isFull && EventPlayProgress <= 0 ? (
            <div className={styles.badges}>
              <div className={styles.badge}>{nbMinutes} min</div>
            </div>
          ) : isFullWatch ? (
            <div className={styles.badges}>
              <div className={classNames(styles.badge)}>{nbMinutes} min</div>
              <div
                className={styles.badge}
                style={{
                  background:
                    "linear-gradient(180deg, #18A0FB 0%, #06D9B1 100%)",
                }}
              >
                {I18N[language]["seen"].toUpperCase()}
              </div>
            </div>
          ) : (
            EventPlayProgress > 0 && (
              <div className={styles.badges}>
                <div className={classNames(styles.badge)}>
                  {`${playProgress} sur ${eventTime} min`}
                </div>
              </div>
            )
          )}
          {renderPlayProgress()}
        </div>
        <div className={styles.container}>
          <div>
            <Link href={receptionPageLink}>
              <h3>
                <Shave maxHeight={90}>{name} </Shave>
              </h3>
            </Link>
            <div
              className={classNames(
                styles.infos,
                options && !options.showReplayInfo && "m-t-xs",
                name.length > 93 && "m-t-m"
              )}
            >
              <ul>
                <li>
                  {(isUpcomming || isLive) && (
                    <>
                      <NewCalendarIcon className="m-r-xs" />
                      <span>
                        <strong>
                          {place && !isWebinar
                            ? capFirstLetterInSentence(
                                I18N[language]["presential"]
                              )
                            : place && isWebinar
                            ? capFirstLetterInSentence(I18N[language]["hybrid"])
                            : capFirstLetterInSentence(
                                I18N[language]["inLive"]
                              )}{" "}
                          :
                        </strong>
                        &thinsp;
                        {dateHelper}
                      </span>
                    </>
                  )}
                </li>
                {renderInReplayTitleWithDesc()}
              </ul>
            </div>
          </div>
          <div className={styles.mainActions}>
            {renderMainAction()}
            {renderEventPrice()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventLayoutFetching() {
  return (
    <div className={classNames(styles.event, styles.fetching)}>
      <div className={classNames(styles.banner, "m-b-m")} />
      <h3 className="m-l-xs m-b-xxs" />
      <div className={classNames(styles.speakers, "greetings")}>
        <h6 className="m-l-xs" />
      </div>
      <div className={styles.infos}>
        <ul className="m-l-xs">
          <li>
            <CalendarIcon />,
            <span>
              <h3 />
            </span>
          </li>
          <li>
            <EarthIcon />,
            <span>
              <h3 />
            </span>
          </li>
        </ul>
      </div>
      <div className="m-t-auto">
        <div className={styles.mainActions} />
      </div>
    </div>
  );
}
