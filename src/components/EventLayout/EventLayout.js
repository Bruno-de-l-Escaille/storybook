"use client";

import cn from "classnames";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { Shave } from "../../common/components/Shave";
import CalendarIcon from "./assets/IconCalendar";
import CheckMarkIcon from "./assets/IconCheckmark";
import HybridIcon from "./assets/IconHybrid";
import LiveIcon from "./assets/IconLive";
import PresentialIcon from "./assets/IconPresential";
import Presential2Icon from "./assets/IconPresential2";
import ReplayIcon from "./assets/IconReplay";
import Replay2Icon from "./assets/IconReplay2";
import ResumeIcon from "./assets/IconResume";
import OngoingIcon from "./assets/IconOngoing";
import styles from "./EventLayout.module.scss";
import {
  capFirstLetterInSentence,
  getApiUrl,
  getByLanguage,
  getCroppedImageUrl,
  isEmpty,
  onError,
  parseBoolean,
  prepareS3ResourceUrl,
} from "../../utils/common";
import {
  formatDateFromTo,
  getEventMode,
  getEventNbMinutes,
  getOfffcourseUrl,
  getSlotReplayUrl,
  isEventFull,
  isEventLive,
  isEventPast,
  isEventRegistrationOpen,
  isFreeEvent,
  isRegistrationActive,
  isSoldOutEvent,
  playProgressTime,
} from "../../utils/event";
import { registerPremiumToEvent } from "../../api/event";
import { ClipLoader } from "react-spinners";
import { CardFlag } from "../../common/components/CardFlag";
import { TimeCounter } from "../../common/components/TimeCounter";
import { Fetching } from "./Fetching";
import { I18N } from "../../i18n";

const REPLAY_UPTIME = 3;
const S3_FOLDER_AWS_URL_WITHOUT_ENV =
  "https://tamtam.s3.eu-west-1.amazonaws.com";
const EVENT_COUNTER_TIME_DELAY = 24;

export function EventLayout({
  language,
  event,
  price,
  dateEndOfReplay: forcedDateEndOfReplay,
  isUserMember,
  isUserPremium,
  isFetching,
  env,
  queryParams = {},
  onClick,
  token,
  userId,
}) {
  const [hovered, setHovered] = useState(false);
  const [isActionProcessing, setIsActionProcessing] = useState(false);

  const apiUrl = getApiUrl(env);

  const handleRegisterPremium = useCallback(
    (e) => {
      e.preventDefault();
      const eventId = event.id;

      setIsActionProcessing(true);
      registerPremiumToEvent({ apiUrl, token, eventId, userId: userId ?? 0 })
        .finally(() => {
          setIsActionProcessing(false);
        })
        .then(() => {
          event["user-registered"] = true;
          if (+event.slotsCount === 1 && event.slotReplayUrls) {
            const replayLink = getSlotReplayUrl(event.slotReplayUrls, language);
            console.log("xLog1", replayLink);
            if (replayLink) {
              window.open(replayLink, "_blank", "noreferrer");
            }
          }
        })
        .catch((e) => onError(language));
    },
    [isActionProcessing, userId]
  );

  if (isFetching) {
    return <Fetching />;
  }

  const {
    clientData,
    isReplayable,
    isVirtual,
    startDateTime,
    endDateTime,
    dateEndOfReplay,
    memberPrice,
    nonMemberPrice,
    "user-registered": isRegistered,
    isIncludedPremium,
    isSaleUnavailableAfter,
  } = event;

  const s3FolderUrl = `http://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;

  const isPast = isEventPast(event);
  const isLive = isEventLive(event);
  const isFull = isEventFull(event);
  const isSoldOut = isSoldOutEvent(event);
  const isFree = isFreeEvent(event);
  const hasUniqueSlot = +event.slotsCount === 1;

  const name = getByLanguage(event, "name", language);
  const label = getByLanguage(event, "label", language, true);
  const city = getByLanguage(event.eventPlace?.city, "city", language);
  const mode = getEventMode(event);

  const isActive =
    event["user-registered"] ||
    (isUserPremium && event.isIncludedPremium === 1);

  const clientImg = clientData?.avatarUrl;

  const urlBanner = getByLanguage(event, "urlBanner", language) ?? "";
  const banner = getCroppedImageUrl(urlBanner, undefined, 300);
  const bannerImgUrl = !isEmpty(banner)
    ? prepareS3ResourceUrl(s3FolderUrl, banner)
    : `${S3_FOLDER_AWS_URL_WITHOUT_ENV}/image_2024_01_08T20_38_38_750Z.png`;

  const nbMinutes = getEventNbMinutes(event);
  const isFullWatch = event?.fullWatch ?? 0;
  const playProgress = playProgressTime(
    event?.playProgress,
    nbMinutes,
    isFullWatch
  );

  const dateHelper = formatDateFromTo(
    startDateTime ?? "",
    endDateTime ?? "",
    language
  );

  const endOfReplay = dateEndOfReplay
    ? moment(dateEndOfReplay)
    : moment.max(moment(endDateTime), moment()).add(REPLAY_UPTIME, "months");
  const endOfReplayYear = endOfReplay.format("YYYY");

  const isReplayExpired = moment().isAfter(endOfReplay);

  const isRegistrationOpen = isFull
    ? isRegistrationActive(event)
    : isEventRegistrationOpen(event);

  const modeLabel = {
    VIRTUAL: I18N[language]["inLive"],
    PRESENTIAL: I18N[language]["presential"],
    HYBRID: I18N[language]["hybrid"],
  };

  const showTimeCounter =
    Math.abs(moment(startDateTime).diff(moment(), "hours")) <
    EVENT_COUNTER_TIME_DELAY;

  const offfcourseUrl = getOfffcourseUrl(env);
  const offfcourseParams = new URLSearchParams(queryParams).toString();
  const eventLink = isFull
    ? `${offfcourseUrl}/event/${event.id}/session?${offfcourseParams}`
    : `${offfcourseUrl}/event/${event.id}/reception?${offfcourseParams}`;
  const onEventClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(event.id, "FORMATION", `/event/${event.id}/reception`);
    } else {
      window.open(eventLink, "_blank", "noreferrer");
    }
  };

  const replayLink =
    +event.slotsCount === 1 && event.slotReplayUrls
      ? getSlotReplayUrl(event.slotReplayUrls, language)
      : undefined;
  const webinarLink = replayLink
    ? replayLink +
      (event.selectedDate
        ? `&selectedDate=${event.selectedDate}&eventDate=${event.startDateTime}`
        : "")
    : undefined;

  const getModeProps = () => {
    if (isPast) {
      if (isReplayable && isVirtual) {
        return {
          icon: <ReplayIcon />,
          label: "Replay",
        };
      }
      return null;
    }

    switch (mode) {
      case "VIRTUAL":
        return {
          icon: <LiveIcon />,
          label: "Live",
        };
      case "PRESENTIAL":
        return {
          icon: <PresentialIcon />,
          label: I18N[language]["inPresential"],
        };
      case "HYBRID":
        return {
          icon: <HybridIcon />,
          label: I18N[language]["hybrid"],
        };
      default:
        return null;
    }
  };

  const getActionProps = () => {
    if (isActive) {
      const joinWebinar =
        isUserPremium && isIncludedPremium && !isRegistered
          ? handleRegisterPremium
          : () => {
              window.open(webinarLink, "_blank", "noreferrer");
            };

      if (isLive) {
        if (webinarLink) {
          return {
            link: "",
            label: I18N[language]["rejoin"],
            theme: "red",
            icon: <OngoingIcon />,
            onClick: joinWebinar,
          };
        } else {
          return {
            link: eventLink,
            label: I18N[language]["rejoin"],
            theme: "red",
            icon: <OngoingIcon />,
            onClick: onEventClick,
          };
        }
      }

      if (isPast && isReplayable && webinarLink && !isReplayExpired) {
        if (isFullWatch) {
          return {
            label: I18N[language]["review"],
            theme: "blue",
            link: "",
            icon: <ReplayIcon />,
            onClick: joinWebinar,
          };
        }
        if (playProgress) {
          return {
            label: I18N[language]["resume"],
            theme: "blue",
            link: "",
            icon: <ResumeIcon />,
            onClick: joinWebinar,
          };
        }
        return {
          label: I18N[language]["play"],
          theme: "blue",
          link: "",
          icon: <ReplayIcon />,
          onClick: joinWebinar,
        };
      }

      if (isPast && isVirtual && isReplayable && isReplayExpired) {
        return {
          label: I18N[language]["replayExpired"],
          theme: "blue",
          link: eventLink,
          disabled: true,
          onClick: onEventClick,
        };
      }

      return {
        label: I18N[language]["details"],
        theme: "default",
        link: eventLink,
        onClick: onEventClick,
      };
    }

    if (
      isRegistrationOpen &&
      !isSoldOut &&
      (!isPast || !isVirtual || !isSaleUnavailableAfter)
    ) {
      let registerLabel = !isPast
        ? I18N[language]["participate"]
        : I18N[language]["buy"];
      if (isFree || (isFull && isPast)) {
        registerLabel = I18N[language]["register"];
      }

      return {
        link: eventLink,
        label: registerLabel,
        theme: "green",
        onClick: onEventClick,
      };
    }

    return {
      label: I18N[language]["details"],
      theme: "default",
      link: eventLink,
      onClick: onEventClick,
    };
  };

  const modeProps = getModeProps();
  const actionProps = getActionProps();

  const renderPrice = () => {
    if (isActive) {
      return (
        <div className={styles.registered}>
          <CheckMarkIcon />
          {I18N[language]["subscribed"]}
        </div>
      );
    }

    if (price) {
      return (
        <div className={styles.price}>
          <div className={styles.mainPrice}>{price} €</div>
        </div>
      );
    }

    if (isFull) {
      return null;
    }

    if (isFree) {
      return (
        <div className={styles.price}>
          <div className={styles.mainPrice}>{I18N[language]["free"]}</div>
        </div>
      );
    }

    const mainPrice = isUserMember ? memberPrice : nonMemberPrice;

    return (
      <div className={styles.price}>
        <div className={styles.mainPrice}>{`${mainPrice} €`}</div>
        {memberPrice !== nonMemberPrice && isUserMember && (
          <div className={styles.originalPrice}>{nonMemberPrice} €</div>
        )}
        {memberPrice !== nonMemberPrice && (
          <div className={cn(styles.memberDiscount)}>
            <div className={styles.discountPercent}>{`${memberPrice} €`}</div>
            <div className={styles.discountDescription}>
              {I18N[language]["forTheMembers"]} OECCBB.
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-id={event.id}
    >
      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${bannerImgUrl})` }}
      >
        <div className={styles.bannerTop}>
          <div>{label && <div className={styles.label}>{label}</div>}</div>
          {clientImg && (
            <div className={styles.clientLogo}>
              <img
                src={clientImg ?? ""}
                alt="client logo"
                width={54}
                height={30}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
        </div>
        <div className={styles.bannerBottom}>
          <div>
            {isLive ? (
              <div className={cn(styles.badge, styles.live)}>
                {I18N[language]["liveNow"]}
              </div>
            ) : showTimeCounter ? (
              <TimeCounter
                date={event.startDateTime}
                language={language}
                showDays={false}
              />
            ) : modeProps ? (
              <div
                className={styles.mode}
                style={hovered ? { maxWidth: 120 } : {}}
              >
                <span className={styles.modeIcon}>{modeProps.icon}</span>
                <span className={styles.modeLabel}>{modeProps.label}</span>
              </div>
            ) : null}
          </div>
          <div className={styles.badges}>
            {Boolean(isFullWatch && !isFull && isVirtual) && (
              <div className={cn(styles.badge, styles.seen)}>
                {I18N[language]["seen"]}
              </div>
            )}
            {Boolean(nbMinutes && hasUniqueSlot && !isFull) && (
              <div className={styles.badge}>
                {!playProgress || !isVirtual || isFull
                  ? `${nbMinutes} min`
                  : `${playProgress} ${I18N[language]["on"]} ${nbMinutes}min`}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.details}>
        <a className={styles.title} href={eventLink} onClick={onEventClick}>
          <Shave maxHeight={70}>{name}</Shave>
        </a>
        <div className={styles.infos}>
          <ul>
            {Boolean(!isPast) && (
              <li>
                <CalendarIcon />
                <span>
                  <strong>
                    {capFirstLetterInSentence(modeLabel[mode])} :{" "}
                  </strong>
                  {dateHelper}
                </span>
              </li>
            )}
            {Boolean(!isEmpty(city) && !isVirtual && !isPast) && (
              <li>
                <Presential2Icon />
                <span>{city}</span>
              </li>
            )}
            {Boolean(
              isPast && isReplayable && isVirtual && !isReplayExpired
            ) && (
              <li>
                <Replay2Icon />
                <span>
                  <strong>{I18N[language]["inReplay"]}</strong>
                  <div className={styles.year}>{endOfReplayYear}</div>
                </span>
              </li>
            )}
          </ul>
        </div>
        <div className={styles.actions}>
          <a
            href={actionProps.link}
            onClick={actionProps.onClick}
            className={cn(
              styles.action,
              styles[actionProps.theme],
              (actionProps.disabled || isActionProcessing) && styles.disabled
            )}
          >
            {!isActionProcessing ? (
              actionProps.icon
            ) : (
              <ClipLoader color="#fff" loading={true} size={14} />
            )}
            {actionProps.label}
          </a>
          {renderPrice()}
        </div>
      </div>
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
    </div>
  );
}
