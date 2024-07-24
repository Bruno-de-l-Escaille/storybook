import { I18N } from "../../../i18n";
import { isEventLive, isEventPast } from "../../../utils/event";

const CURRENT_CONGRESS_ID = 738;

export const TAX_TV_SHOW_EVENTS_IDS = [
  570,
  571,
  573,
  574,
  576,
  577,
  578,
  579,
  580,
  581,
  654,
  655,
  656,
  657,
  658,
  659,
  660,
  661,
  662,
  668,
];

export const getEventSideConfig = (event, language) => {
  const { isVirtual, eventPlace } = event;

  const isWebinar = isVirtual && !eventPlace;
  const isHybrid = isVirtual && eventPlace;
  const isOnSite = !isVirtual;

  const isLive = isEventLive(event);
  const isPast = isEventPast(event);

  // special events

  if (event.id === CURRENT_CONGRESS_ID) {
    return {
      label: I18N[language].congress,
      secondaryBanner: "/img/slides/event-banner.jpeg",
    };
  }

  if (TAX_TV_SHOW_EVENTS_IDS.includes(event.id)) {
    return {
      label: "TAX TV-SHOW",
      secondaryBanner: "/img/slides/event-banner.jpeg",
    };
  }

  // past and live events

  if (isLive) {
    return {
      label: I18N[language].liveNow,
      secondaryBanner: "/img/slides/event-banner.jpeg",
    };
  }

  if (isPast) {
    return {
      label: I18N[language].inReplay,
      secondaryBanner: "/img/slides/event-banner.jpeg",
    };
  }

  // upcoming events

  if (isWebinar) {
    return {
      label: I18N[language].soonLive,
      secondaryBanner: "/img/slides/event-banner.jpeg",
    };
  }

  if (isOnSite) {
    return {
      label: I18N[language].soonInPerson,
      secondaryBanner: "/img/slides/event-banner.jpeg",
    };
  }

  if (isHybrid) {
    return {
      label: I18N[language].soonInPerson,
      secondaryBanner: "/img/slides/event-banner.jpeg",
    };
  }
};
