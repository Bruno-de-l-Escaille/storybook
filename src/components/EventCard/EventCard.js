import React, { PureComponent } from "react";

import classnames from "classnames";

import styles from "./EventCard.module.scss";
import { APP_ENV } from "../../config";
import { getDateLabel } from "../../utils";
import { Fetching } from "./Fetching";
import { I18N } from "../../i18n";

export class EventCard extends PureComponent {
  render() {
    const {
      language,
      event,
      index,
      fromCycle,
      newPrice,
      myEventsType,
      isFetching,
      eventUrl,
    } = this.props;

    const {
      eventDate,
      clientData,
      memberPrice,
      startDateTime,
      endDateTime,
      isReplayable,
      slotReplayUrls,
    } = event;
    let duration =
      new Date(endDateTime).getTime() - new Date(startDateTime).getTime();

    let helpDate = getDateLabel(eventDate).split(",")[0];
    const sameDay = duration < 86400000;
    if (sameDay) {
      const start = getDateLabel(startDateTime).split(", at");
      helpDate = `${start[0]} from ${start[1]} to ${
        getDateLabel(endDateTime).split(", at")[1]
      }`;
    }

    let processing = false;
    if (
      new Date().getTime() > new Date(startDateTime).getTime() &&
      new Date().getTime() - new Date(startDateTime).getTime() < duration
    ) {
      processing = true;
    }
    let passed = false;
    if (new Date().getTime() > new Date(endDateTime).getTime()) {
      passed = true;
    }

    const hours = Math.floor(duration / 1000 / 60 / 60);
    duration -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(duration / 1000 / 60);
    duration -= minutes * 1000 * 60;

    let webinarUrl =
      slotReplayUrls && slotReplayUrls.webinarUrlEn
        ? slotReplayUrls.webinarUrlEn
        : null;

    if (webinarUrl) {
      const videoAttr = `webinarReplayVideo${
        language.charAt(0).toUpperCase() + language.slice(1)
      }`;
      if (slotReplayUrls[videoAttr]) {
        webinarUrl += `?lng=${language}&video${
          language.charAt(0).toUpperCase() + language.slice(1)
        }=${slotReplayUrls[videoAttr]}`;
      }
    }

    const bannerAttr = `urlBanner${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;

    const nameAttr = `name${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;

    const placeAttr = `place${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;

    const labelAttr = `label${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;

    let place = event[placeAttr];
    if (!place || place.length === 0) {
      const lngs = ["Fr", "En", "Nl"];
      for (let i = 0; i < lngs.length; i++) {
        if (
          lngs[i].toLowerCase() !== language &&
          event[`place${lngs[i]}`] &&
          event[`place${lngs[i]}`].length > 0
        ) {
          place = event[`place${lngs[i]}`];
          break;
        }
      }
    }

    let banner = event[bannerAttr];
    if (!banner || banner.length === 0) {
      const lngs = ["Fr", "En", "Nl"];
      for (let i = 0; i < lngs.length; i++) {
        if (
          lngs[i].toLowerCase() !== language &&
          event[`banner${lngs[i]}`] &&
          event[`banner${lngs[i]}`].length > 0
        ) {
          banner = event[`banner${lngs[i]}`];
          break;
        }
      }
    }

    let desc = "";
    let dotes = "";
    const maxWords = 8;
    if (event[nameAttr]) {
      const splt = event[nameAttr].split(" ");
      const lgt = splt.length;
      desc = splt.splice(0, maxWords).join(" ");
      if (lgt > maxWords) {
        dotes = "...";
      }
    }
    desc += dotes;

    const appEnv = APP_ENV === "rc2" ? "rc" : APP_ENV;

    let speaker = null;
    if (event["speakers-abstract"] && event["speakers-abstract"].speakers) {
      const { firstName, lastName } = event["speakers-abstract"].speakers[0];
      speaker = `${firstName} ${lastName}`;
    }

    let clientLogo = "";

    if (clientData && clientData.avatarUrl) {
      clientLogo = clientData.avatarUrl;
    }
    if (isFetching) {
      return <Fetching />;
    }
    return (
      <div
        className={classnames(
          styles.event,
          index === 0 ? styles.noMargin : "",
          fromCycle ? styles.fromCycle : "",
          myEventsType ? styles.mine : ""
        )}
      >
        <div className={styles.eventContent}>
          <div
            className={styles.banner}
            style={{
              backgroundImage: `url(https://s3.tamtam.pro/${appEnv}${banner.replace(
                "eventsFolder",
                "events-folder"
              )})`,
            }}
          >
            {fromCycle ? null : (
              <div className={styles.communityLogo}>
                <span
                  style={{
                    backgroundImage: `url(${clientLogo})`,
                  }}
                ></span>
              </div>
            )}
            {!myEventsType ? null : (
              <div className={styles.bagde}>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="#02AF8E">
                  <path d="M5.29484 14C4.85964 14 4.44804 13.7964 4.18344 13.4472L0.609843 8.72782C0.145043 8.11402 0.266043 7.24002 0.879843 6.77502C1.49464 6.30982 2.36804 6.43162 2.83304 7.04502L5.18344 10.1486L11.0948 0.657024C11.5018 0.00402431 12.3612 -0.195776 13.0156 0.210624C13.6692 0.617424 13.8688 1.47742 13.4616 2.13102L6.47844 13.343C6.23584 13.7328 5.81704 13.978 5.35844 13.9988C5.33704 13.9996 5.31604 14 5.29484 14Z"></path>
                </svg>
              </div>
            )}
            {!event[labelAttr] ? null : (
              <div className={styles.lable}>
                <i className="icon icon-info" />
                {event[labelAttr]}
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <span className={styles.eventType}>
              {newPrice ? <span>{newPrice} €</span> : null}
              <span className={newPrice ? styles.barred : ""}>
                {memberPrice} €
              </span>
            </span>

            <span
              className={styles.eventType}
            >{`${hours}h ${minutes}min`}</span>
          </div>
          <h3>{desc}</h3>
          {speaker ? <h4>{speaker}</h4> : null}
          <ul className={styles.infos}>
            {processing ? (
              <li>
                <i className={styles.pending} />
                <span>{I18N[language]["In progress"]}</span>
              </li>
            ) : (
              <li>
                <i className="icon icon-calendar" />
                <span>
                  <strong>{I18N[language]["En Live"]}</strong> : {helpDate}
                </span>
              </li>
            )}
            {/* {isReplayable && isReplayable === 1 ? (
              <li>
                <i className="icon icon-globe" />
                <span>{I18N[language]["Webinar"]}</span>
              </li>
            ) : null} */}
            {!myEventsType && isReplayable && isReplayable === 1 ? (
              <li>
                <i className="icon icon-control-play" />

                <span>
                  {
                    I18N[language][
                      "Possible to review the training for max 15 days after the date of the live"
                    ]
                  }
                </span>
              </li>
            ) : null}
            {!myEventsType && (
              <li>
                <i className="icon icon-badge" />

                <span>
                  {I18N[language]["Certificate included approved by"]}{" "}
                  <strong>{clientData.abbreviation}</strong>{" "}
                </span>
              </li>
            )}
            {/* {event[placeAttr] ? (
              <li>
                <i className="icon icon-location-pin" />
                <span>{event[placeAttr].split("contact")[0]}</span>
              </li>
            ) : null} */}
          </ul>
          <div className={styles.controls}>
            {passed || fromCycle || myEventsType ? null : (
              <a
                className={classnames(styles.btn, styles.btnPrimary)}
                href={`${eventUrl}/plan-selector?eventId=${event.id}`}
                target="_blank"
              >
                {I18N[language]["Purchase"]}
              </a>
            )}
            {webinarUrl && myEventsType && myEventsType === "REPLAY" ? (
              <a
                className={classnames(styles.btn, styles.btnBlue)}
                href={webinarUrl}
                target="_blank"
              >
                <i className="icon icon-control-play" />
                {I18N[language]["Replay"]}
              </a>
            ) : null}
            <a
              className={classnames(
                styles.btn,
                styles.btnSecondary,
                (!myEventsType || myEventsType === "SPACE") &&
                  (passed || fromCycle)
                  ? styles.btn100
                  : ""
              )}
              href={`${eventUrl}/event/${event.id}/reception?tool=register`}
              target="_blank"
            >
              {I18N[language]["Details"]}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
