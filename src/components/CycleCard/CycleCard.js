import React from "react";
import styles from "./CycleCard.module.scss";
import {
  capFirstLetterInSentence,
  getByLanguage,
  getCroppedImageUrl,
  isEmpty,
  prepareS3ResourceUrl,
} from "../../utils/common";
import {
  cycleType,
  formatDateFromTo,
  formatDecimalHours,
  getCycleLabels,
  getCyclePrice,
  getOfffcourseUrl,
  isCycleEssential,
  isCyclePast,
  isCycleRegistrationOpen,
  isCycleSeason,
  isSoldOutCycle,
  totalCycleTrainingHours,
} from "../../utils/event";
import classNames from "classnames";
import { I18N } from "../../i18n";
import { Shave } from "../../common/components/Shave";
import { Fetching } from "./Fetching";
import { CardFlag } from "../../common/components/CardFlag";
import CalendarIcon from "./assets/IconCalendar";
import ReplayIcon from "./assets/IconReplay";
import PresentialIcon from "./assets/IconPresential";
import LiveIcon from "./assets/IconLive";
import Presential2Icon from "./assets/IconPresential2";
import Replay2Icon from "./assets/IconReplay2";
import moment from "moment";
import CheckMarkIcon from "./assets/IconCheckmark";
import HybridIcon from "./assets/IconHybrid";

const REPLAY_UPTIME = 3;

const S3_FOLDER_AWS_URL_WITHOUT_ENV =
  "https://tamtam.s3.eu-west-1.amazonaws.com";

export function CycleCard({
  cycle,
  price,
  language,
  isUserMember,
  isUserPremium,
  isFetching,
  env,
  queryParams = {},
  onClick,
  isOFFFcourse,
}) {
  if (isFetching) {
    return <Fetching />;
  }

  const {
    startDateTime,
    endDateTime,
    clientData,
    isReplayable,
    dateEndOfReplay,
  } = cycle;
  const name = getByLanguage(cycle, "name", language);
  const dateHelper = formatDateFromTo(startDateTime, endDateTime, language);

  const { memberPrice, nonMemberPrice } = getCyclePrice(cycle);

  const s3FolderUrl = `http://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;
  const offfcourseUrl = getOfffcourseUrl(env);
  const offfcourseParams = new URLSearchParams(queryParams).toString();

  const isSeason = isCycleSeason(cycle);
  const isEssential = isCycleEssential(cycle);

  const isUserRegistered = cycle["user-registered"];

  const endOfReplay = dateEndOfReplay
    ? moment(dateEndOfReplay)
    : moment.max(moment(endDateTime), moment()).add(REPLAY_UPTIME, "months");
  const endOfReplayYear = endOfReplay.format("YYYY");

  const isReplayExpired = moment().isAfter(endOfReplay);

  const type = cycle.eventCycles ? cycleType(cycle.eventCycles) : "WEBINAR";
  console.log("AAAA", type);
  const urlBanner = getByLanguage(cycle, "pictureUrl", language) ?? "";
  const banner = getCroppedImageUrl(urlBanner, undefined, 280);
  const bannerImgUrl = !isEmpty(banner)
    ? prepareS3ResourceUrl(s3FolderUrl, banner)
    : `${S3_FOLDER_AWS_URL_WITHOUT_ENV}/image_2024_01_08T20_38_38_750Z.png`;

  const cycleCertifiedTrainingHours = totalCycleTrainingHours(cycle);
  const cycleTrainingHours = formatDecimalHours(
    cycleCertifiedTrainingHours,
    language,
    true
  );

  const modeLabel = {
    WEBINAR: I18N[language]["inLive"],
    PRESENTIAL: I18N[language]["presential"],
    HYBRID: I18N[language]["hybrid"],
  };

  const clientImg = clientData?.avatarUrl;

  const isPast = isCyclePast(cycle);

  const trainingsCount = cycle.eventCycles?.length;

  const isSoldOut = isSoldOutCycle(cycle);

  const isPremiumIncludedCycle = +cycle.client === 9;
  const isActive =
    isUserRegistered || (isPremiumIncludedCycle && isUserPremium);

  const { cycleLabel } = getCycleLabels(cycle, language);

  const cycleLink = `${offfcourseUrl}/cycle/${cycle.id}/reception?${offfcourseParams}`;
  const onCycleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(cycle.id, "CYCLE", `/cycle/${cycle.id}/reception`);
    } else if (!isOFFFcourse) {
      window.open(cycleLink, "_blank", "noreferrer");
    } else {
      window.location.href = cycleLink;
    }
  };

  const getActionProps = () => {
    if (!isActive && isCycleRegistrationOpen(cycle)) {
      return {
        link: cycleLink,
        label: I18N[language]["buy"],
        theme: "green",
        onClick: onCycleClick,
      };
    }

    return {
      label: I18N[language]["details"],
      theme: "default",
      link: cycleLink,
      onClick: onCycleClick,
    };
  };

  const getModeProps = () => {
    if (isPast) {
      if (isReplayable && type === "WEBINAR") {
        return {
          icon: <ReplayIcon />,
          label: "Replay",
        };
      }
      return null;
    }

    switch (type) {
      case "WEBINAR":
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

    const mainPrice = isUserMember ? memberPrice : nonMemberPrice;

    return (
      <div className={styles.price}>
        {memberPrice.price !== nonMemberPrice.price && (
          <div className={classNames(styles.memberDiscount)}>
            <div
              className={styles.discountPercent}
            >{`${memberPrice.price} €`}</div>
            <div className={styles.discountDescription}>
              {I18N[language]["forTheMembers"]} OECCBB.
            </div>
          </div>
        )}
        <div className={styles.mainPrice}>{`${mainPrice.price} €`}</div>
        {memberPrice.price !== nonMemberPrice.price && isUserMember && (
          <div className={styles.originalPrice}>{nonMemberPrice.price} €</div>
        )}
      </div>
    );
  };

  const modeProps = getModeProps();
  const actionProps = getActionProps();

  return (
    <div className={styles.wrapper}>
      <div
        className={classNames(styles.banner)}
        style={{ backgroundImage: `url(${bannerImgUrl})` }}
      >
        <div className={styles.bannerTop}>
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
            {modeProps ? (
              <div className={styles.mode}>
                <span className={styles.modeIcon}>{modeProps.icon}</span>
              </div>
            ) : null}
          </div>
          {trainingsCount && cycleTrainingHours && (
            <div className={styles.badges}>
              <div className={classNames(styles.badge)}>
                <strong>{trainingsCount}</strong>&thinsp;
                {I18N[language]["trainings"]}
              </div>
              <div className={classNames(styles.badge)}>
                <strong>{cycleTrainingHours}</strong>
                &thinsp;
                {I18N[language]["ofCertifiedAttestations"]}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={classNames(styles.details, {
          [styles.season]: isSeason,
          [styles.essential]: isEssential,
        })}
      >
        <div className={styles.type}>{cycleLabel}</div>
        <a className={styles.title} href={cycleLink} onClick={onCycleClick}>
          <Shave maxHeight={70}>{name}</Shave>
        </a>
        <div className={styles.infos}>
          <ul>
            {Boolean(!isPast) && (
              <li>
                <CalendarIcon />
                <span>
                  <strong>
                    {capFirstLetterInSentence(modeLabel[type])} :&nbsp;
                  </strong>
                  {dateHelper}
                </span>
              </li>
            )}
            {Boolean(type === "PRESENTIAL" && !isPast) && (
              <li>
                <Presential2Icon />
                <span>
                  <strong>
                    {capFirstLetterInSentence(modeLabel[type])} :&nbsp;
                  </strong>
                  {dateHelper}
                </span>
              </li>
            )}
            {Boolean(
              isPast && isReplayable && type === "WEBINAR" && !isReplayExpired
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
            className={classNames(
              styles.action,
              styles[actionProps.theme],
              actionProps.disabled && styles.disabled
            )}
          >
            {actionProps.icon}
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
            : isPremiumIncludedCycle && !isActive
            ? "premium"
            : undefined
        }
      />
    </div>
  );
}
