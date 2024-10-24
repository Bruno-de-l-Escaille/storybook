import React, { useState } from "react";
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
  formatDateEndOfReplay,
  formatDateFromTo,
  formatDecimalHours,
  getCycleLabels,
  getCyclePrice,
  getOfffcourseUrl,
  isCycleEssential,
  isCycleIncludedInPremium,
  isCycleRegistrationOpen,
  isCycleSeason,
  totalCycleTrainingHours,
} from "../../utils/event";
import classNames from "classnames";
import { I18N } from "../../i18n";
import { RegisteredBadge } from "../../common/components/RegisteredBadge";
import NewCalendarIcon from "../Icons/NewCalendar";
import PresentialDescriptionIcon from "../Icons/PresentialDescription";
import PresentialIcon from "../Icons/Presential";
import LiveDescriptionIcon from "../Icons/LiveDescription";
import LiveIcon from "../Icons/Live";
import { Shave } from "../../common/components/Shave";
import { Fetching } from "./Fetching";
import { CardFlag } from "../../common/components/CardFlag";

const S3_FOLDER_AWS_URL_WITHOUT_ENV =
  "https://tamtam.s3.eu-west-1.amazonaws.com";

export const modeLabelMapper = {
  PRESENTIAL: "presential",
  WEBINAR: "inLive",
  HYBRID: "hybrid",
};

export function CycleCard({
  cycle,
  language,
  isUserMember,
  isUserPremium,
  isFetching,
  env,
  queryParams = {},
  onClick,
}) {
  const [showIcons, setShowIcons] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (isFetching) {
    return <Fetching />;
  }

  const { startDateTime, endDateTime, clientData } = cycle;
  const name = getByLanguage(cycle, "name", language);
  const dateHelper = formatDateFromTo(startDateTime, endDateTime, language);
  const dateEndOfReplay = formatDateEndOfReplay(
    cycle.dateEndOfReplay,
    cycle.endDateTime
  );
  const { memberPrice, nonMemberPrice } = getCyclePrice(cycle);

  const s3FolderUrl = `http://s3.tamtam.pro/${
    env === "v2" ? "production" : env
  }`;
  const offfcourseUrl = getOfffcourseUrl(env);
  const offfcourseParams = new URLSearchParams(queryParams).toString();

  const isSeason = isCycleSeason(cycle);
  const isEssential = isCycleEssential(cycle);

  const isUserRegistered = cycle["user-registered"];

  const type = cycle.eventCycles ? cycleType(cycle.eventCycles) : "WEBINAR";

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

  const cyclePrice = isUserMember ? memberPrice : nonMemberPrice;
  const trainingsCount = cycle.eventCycles?.length;

  const { cycleLabel } = getCycleLabels(cycle, language);

  const renderActions = () => {
    if (!isUserPremium && !isUserRegistered) {
      return (
        <div className={classNames(styles.actions, styles.fullWidth)}>
          {isCycleRegistrationOpen(cycle) && (
            <a
              className={classNames(styles.green, styles.mobileActions)}
              href={
                onClick
                  ? undefined
                  : `${offfcourseUrl}/cycle/${cycle.id}/reception?${offfcourseParams}`
              }
              target={onClick ? undefined : "_blank"}
              rel={onClick ? undefined : "noopener noreferrer"}
              onClick={
                onClick
                  ? () =>
                      onClick(cycle.id, "CYCLE", `/cycle/${cycle.id}/reception`)
                  : undefined
              }
            >
              {I18N[language]["buy"]}
            </a>
          )}
        </div>
      );
    }

    return (
      <div className={classNames(styles.actions)}>
        <div className={styles.premiumRegistered}>
          <RegisteredBadge theme="green" className={styles.registerBadge} />
          <span className={styles.registerText}>
            {isUserPremium
              ? I18N[language]["subscribedPremium"]
              : I18N[language]["subscribed"]}
          </span>
        </div>
      </div>
    );
  };

  const renderCyclePrice = () => (
    <div
      className={styles.badge}
      style={{ display: "flex", alignItems: "center" }}
    >
      {memberPrice.price !== nonMemberPrice.price && (
        <span className={classNames(styles.reductionOrg)}>
          <span style={{ fontSize: "14px" }}> {memberPrice.price} €</span>
          <span> {I18N[language]["forTheMembers"]} OECCBB.</span>
        </span>
      )}
      {isUserMember && memberPrice.price !== nonMemberPrice.price && (
        <span
          className={classNames(styles.strike, "m-l-xs")}
          style={{ fontWeight: "500" }}
        >
          {nonMemberPrice.price} €
        </span>
      )}
      {isUserMember && memberPrice.price !== nonMemberPrice.price ? (
        <span
          className="m-l-xs"
          style={{ color: "#29394D", fontWeight: "600", fontSize: "18px" }}
        >
          {memberPrice.price} <span style={{ fontSize: "12px" }}>€</span>
        </span>
      ) : (
        <span
          className="m-l-xs"
          style={{ color: "#29394D", fontWeight: "600", fontSize: "18px" }}
        >
          {nonMemberPrice.price} <span style={{ fontSize: "12px" }}>€</span>
        </span>
      )}
    </div>
  );

  const renderDetails = () => (
    <ul>
      <li>
        <NewCalendarIcon className="m-r-xs" />
        <span>
          <b className="tc">
            {capFirstLetterInSentence(I18N[language][modeLabelMapper[type]])}{" "}
            {" : "}
          </b>
          {dateHelper}
        </span>
      </li>
    </ul>
  );

  const handleOnMouseEnter = () => {
    setShowIcons(true);
    setHovered(true);
  };
  const handleOnMouseLeave = () => {
    setShowIcons(false);
  };

  const renderHoveringIcons = () => (
    <>
      <div className={styles.cycleStateIcon}>
        {showIcons && type === "PRESENTIAL" ? (
          <>
            <PresentialDescriptionIcon />
            <span className={styles.cycleStateDescriptionIcon}>
              {I18N[language]["inPresential"].toUpperCase()}
            </span>
          </>
        ) : type === "PRESENTIAL" ? (
          <PresentialIcon />
        ) : (
          <></>
        )}
      </div>
      <div
        className={
          type === "PRESENTIAL"
            ? classNames(styles.cycleStateIcon, styles.multipleIcons)
            : styles.cycleStateIcon
        }
      >
        {showIcons && type === "WEBINAR" ? (
          <a
            href={
              onClick
                ? undefined
                : `${offfcourseUrl}/cycle/${cycle.id}/reception?${offfcourseParams}`
            }
            target={onClick ? undefined : "_blank"}
            rel={onClick ? undefined : "noopener noreferrer"}
            onClick={
              onClick
                ? () =>
                    onClick(cycle.id, "CYCLE", `/cycle/${cycle.id}/reception`)
                : undefined
            }
          >
            <div style={{ bottom: "40px" }}>
              <LiveDescriptionIcon />
              <span className={styles.cycleStateDescriptionIcon}>
                {I18N[language]["live"]}
              </span>
            </div>
          </a>
        ) : type === "WEBINAR" ? (
          <LiveIcon />
        ) : (
          <></>
        )}
      </div>
    </>
  );

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.season]: isSeason,
        [styles.essential]: isEssential,
      })}
    >
      <div
        className={classNames(styles.cycle, styles.active)}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <div>
          <div
            className={classNames(styles.banner)}
            style={{ backgroundImage: `url(${bannerImgUrl})` }}
          >
            {!isEmpty(clientData?.avatarUrl) && (
              <div className={styles.logoWrapper}>
                <span
                  style={{
                    backgroundImage: `url(${clientData?.avatarUrl})`,
                  }}
                />
              </div>
            )}
            {isCycleIncludedInPremium(cycle) && (
              <CardFlag language={language} flag="premium" />
            )}
            {renderHoveringIcons()}

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
        <div className={styles.container}>
          <div className={styles.container_upper}>
            <div className={styles.type}>{cycleLabel}</div>
            <div className={styles.title}>
              <a
                href={
                  onClick
                    ? undefined
                    : `${offfcourseUrl}/cycle/${cycle.id}/reception?${offfcourseParams}`
                }
                target={onClick ? undefined : "_blank"}
                rel={onClick ? undefined : "noopener noreferrer"}
                onClick={
                  onClick
                    ? () =>
                        onClick(
                          cycle.id,
                          "CYCLE",
                          `/cycle/${cycle.id}/reception`
                        )
                    : undefined
                }
              >
                <h3>
                  <Shave maxHeight={76}>{name}</Shave>
                </h3>
              </a>
            </div>
          </div>
          {renderDetails()}
          <div className={classNames(styles.mainActions)}>
            {renderActions()}
            {renderCyclePrice()}
          </div>
        </div>
      </div>
    </div>
  );
}
