import moment from "moment";
import {
  appendParamsToLink,
  capitalize,
  getByLanguage,
  getNotNullLanguages,
  isEmpty,
  parseBoolean,
  parseJson,
} from "./common";
import { I18N } from "../i18n";

const belgiumCurrentdate = new Date().toLocaleString("EN", {
  timeZone: "Europe/Brussels",
});

export const isEventFull = (event) => +event.type === 5;

export const isEventPast = (event) =>
  moment(belgiumCurrentdate).isAfter(moment(event.endDateTime));

export const isEventUpcoming = (event) =>
  moment(belgiumCurrentdate).isBefore(moment(event.startDateTime));

export const isEventReplayable = (event) => +event.isReplayable === 1;

export const isEventLive = (event) =>
  moment(belgiumCurrentdate).isBetween(
    moment(event.startDateTime),
    moment(event.endDateTime)
  );

export const isWebinarEvent = (event) => event.isVirtual === 1;

export const isSoldOutEvent = (event) =>
  Number(event.maxNumber) <= Number(event.registeredCount) &&
  !isEventFull(event);

export const calculateTimeDifference = (startDateTime, endDateTime) => {
  if (!startDateTime) {
    return { hours: null, minutes: null, seconds: null };
  }

  const belgiumCurrentdate = new Date().toLocaleString("EN", {
    timeZone: "Europe/Brussels",
  });
  const dateDifference =
    endDateTime && startDateTime
      ? +new Date(startDateTime) - +new Date(endDateTime)
      : +new Date(startDateTime) - +new Date(belgiumCurrentdate);
  const difference = Math.abs(dateDifference);
  return {
    hours: Math.floor(difference / (1000 * 60 * 60)),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export const getEventNbMinutes = (event) => {
  if (isEmpty(event)) {
    return 0;
  }
  const startTime = moment(event.startDateTime);
  const endTime = moment(event.endDateTime);
  return endTime.diff(startTime, "minutes");
};

export const playProgressTime = (playProgres, eventTime, isFullWatch) => {
  if (isFullWatch && eventTime) {
    return eventTime;
  }
  if (playProgres && playProgres > 0) {
    const playProgresMinute = Math.round(playProgres / 60);

    if (eventTime && playProgresMinute > eventTime) {
      return eventTime;
    }

    return playProgresMinute;
  }

  return playProgres ? Math.round(playProgres / 60) : 0;
};

export const calculatePlayProgressTime = (
  eventTime,
  playProgres,
  isFullWatch
) => {
  if (isFullWatch) {
    return 100;
  }

  if (playProgres && playProgres > 0) {
    return ((playProgres / 60) * 100) / eventTime;
  }

  return 0;
};

export const formatDateEndOfReplay = (date, entityEndDate) => {
  if (date) {
    const dateObj = new Date(date.replace(/-/g, "/"));
    return new Intl.DateTimeFormat("fr-FR").format(dateObj);
  }

  const currentDate = new Date();

  if (entityEndDate) {
    const parsedEntityEndDate = new Date(entityEndDate.replace(/-/g, "/"));

    if (parsedEntityEndDate > currentDate) {
      const replayEndDate = new Date(
        parsedEntityEndDate.setMonth(parsedEntityEndDate.getMonth() + 3)
      );
      return new Intl.DateTimeFormat("fr-FR").format(replayEndDate);
    }
  }

  const replayEndDate = new Date(
    currentDate.setMonth(currentDate.getMonth() + 3)
  );
  return new Intl.DateTimeFormat("fr-FR").format(replayEndDate);
};

export const formatDateFromTo = (
  startDateTime,
  endDateTime,
  language = "fr",
  dateFormat = "ll"
) => {
  if (isEmpty(startDateTime) && isEmpty(endDateTime)) {
    return "";
  }

  if (isEmpty(endDateTime)) {
    return moment(startDateTime).locale(language).format(dateFormat);
  }

  if (isEmpty(startDateTime)) {
    return moment(endDateTime).locale(language).format(dateFormat);
  }

  const startDate = moment(startDateTime).locale(language);
  const endDate = moment(endDateTime).locale(language);
  const isSameYear = startDate.isSame(endDate, "years");
  const isSameDay = startDate.isSame(endDate, "day");
  const isSameMonth = startDate.isSame(endDate, "month");

  if (isSameYear && isSameDay) {
    return `${startDate.format(dateFormat)} ${
      I18N[language]["dateFrom"]
    } ${startDate.format("HH:mm")} ${I18N[language]["timeTo"]} ${endDate.format(
      "HH:mm"
    )}`;
  }

  if (isSameYear && isSameMonth) {
    return `${I18N[language]["dateFrom"]} ${startDate.format("DD")} ${
      I18N[language]["dateTo"]
    } ${endDate.format(dateFormat)}`;
  }

  if (isSameYear) {
    return `${I18N[language]["dateFrom"]} ${startDate.format("DD MMM")} ${
      I18N[language]["dateTo"]
    } ${endDate.format(dateFormat)}`;
  }

  return `${I18N[language]["dateFrom"]} ${startDate.format(dateFormat)} ${
    I18N[language]["dateTo"]
  } ${endDate.format(dateFormat)}`;
};

export const isFreeEvent = (event) => {
  const { memberPrice, nonMemberPrice, type } = event;

  if (+type === 5) {
    return false;
  }

  const isEmptyMemberPrice = +memberPrice === 0 || Number.isNaN(+memberPrice);
  const isEmptyNonMemberPrice =
    +nonMemberPrice === 0 || Number.isNaN(+nonMemberPrice);

  return isEmptyMemberPrice && isEmptyNonMemberPrice;
};

export const isRegistrationActive = (event, isAdmin = false) => {
  const stages = parseJson(event.stages);

  if (+event.type !== 5) {
    return true;
  }

  return (
    stages.inscription &&
    (stages.inscription === "true" ||
      (stages.inscription === "admin" && isAdmin))
  );
};

export const isEventRegistrationOpen = (event) => +event.status === 1;

export const getSlotReplayUrl = (data, language) => {
  const { webinarUrlEn } = data;

  if (isEmpty(webinarUrlEn)) {
    return null;
  }
  const languages = getNotNullLanguages(data, "webinarReplayVideo");

  if (languages.length === 0) {
    return null;
  }

  const mainLanguage =
    languages.indexOf(language) !== -1 ? language : languages[0];
  const linkParams = [["lng", mainLanguage]];
  languages.forEach((lng) => {
    linkParams.push([
      `video${capitalize(lng)}`,
      getByLanguage(data, "webinarReplayVideo", lng) ?? "",
    ]);
  });

  return appendParamsToLink(webinarUrlEn, linkParams);
};

export const isReplayExpiredForUser = (guest) => {
  const { dateEndOfReplay } = guest;
  return !dateEndOfReplay || moment().isAfter(moment(dateEndOfReplay));
};

export const getCyclePrice = (cycle) => {
  const {
    memberPrice: cycleMemberPrice,
    nonMemberPrice: cycleNonMemberPrice,
  } = cycle;

  const member =
    cycle && cycle.allEventsPrices ? cycle.allEventsPrices.member : undefined;
  const nonMember =
    cycle && cycle.allEventsPrices
      ? cycle.allEventsPrices.nonMember
      : undefined;

  return {
    memberPrice: {
      price: cycleMemberPrice,
      originalPrice: member && cycleMemberPrice < member ? member : null,
    },
    nonMemberPrice: {
      price: cycleNonMemberPrice,
      originalPrice:
        nonMember && cycleNonMemberPrice < nonMember ? nonMember : null,
    },
  };
};

export const isCycleSeason = (cycle) => parseBoolean(cycle.type === 2);

export const isCycleEssential = (cycle) => parseBoolean(cycle.type === 3);

export const cycleType = (eventCycles) => {
  // Check if eventCycles is empty
  if (eventCycles.length === 0) {
    return "WEBINAR";
  }

  const allVirtual = eventCycles.every(
    (event) => event?.eventsAbstract.isVirtual == 1
  );
  const allPresential = eventCycles.every(
    (event) => event?.eventsAbstract.isVirtual == 0
  );

  if (allVirtual) {
    return "WEBINAR";
  }
  if (allPresential) {
    return "PRESENTIAL";
  }
  return "HYBRID";
};

export const totalCycleTrainingHours = (cycle) => {
  let cycleEventsNbMinutes = 0;

  cycle.eventCycles &&
    cycle.eventCycles.forEach(({ eventsAbstract }) => {
      cycleEventsNbMinutes += getEventNbMinutes(eventsAbstract);
    });

  return cycleEventsNbMinutes / 60;
};

export const formatDecimalHours = (
  decimalHours,
  language = "fr",
  withAbr = true
) => {
  const hoursLabel = withAbr
    ? I18N[language]["hourAbr"]
    : ` ${I18N[language]["hours"]}`;
  const minutesLabel = withAbr ? "min" : ` ${I18N[language]["minutes"]}`;
  const sep = withAbr ? " " : ` ${I18N[language]["and"]} `;

  if (!decimalHours || Number.isNaN(+decimalHours)) {
    return `0${hoursLabel}`;
  }

  let hours = +decimalHours;
  let minutes = 0;

  minutes = hours % 1;
  hours = Math.floor(hours);
  minutes = Math.round(minutes * 60);

  if (minutes === 60) {
    minutes = 0;
    hours++;
  }

  if (minutes > 0 && hours > 0) {
    return `${hours}${hoursLabel}${sep}${minutes}${minutesLabel}`;
  }

  if (minutes > 0) {
    return `${minutes}${minutesLabel}`;
  }

  return `${hours}${hoursLabel}`;
};

export const isCycleRegistrationOpen = (cycle) => cycle.status === 1;

export const getOfffcourseUrl = (env) => {
  const mapper = {
    production: "https://offfcourse.be",
    v2: "https://offfcourse.be",
    staging: "https://staging.offfcourse.be",
    dev: "https://dev.offfcourse.be",
    local: "http://local.offfcourse.be:3005",
  };

  return mapper[env] ?? mapper["production"];
};

export const ORGANIZATION_CYCLE_LABEL_CONFIGS = {
  default: {
    1: {
      fr: {
        label: "cycle",
        definiteLabel: "le cycle",
      },
      en: {
        label: "cycle",
        definiteLabel: "the cycle",
      },
      nl: {
        label: "cyclus",
        definiteLabel: "de cyclus",
      },
    },
    2: {
      fr: {
        label: "saison",
        definiteLabel: "la saison",
      },
      en: {
        label: "season",
        definiteLabel: "the season",
      },
      nl: {
        label: "seizoen",
        definiteLabel: "het seizoen",
      },
    },
    3: {
      fr: {
        label: "essentiel",
        definiteLabel: "l'essentiel",
      },
      en: {
        label: "essential",
        definiteLabel: "the essential",
      },
      nl: {
        label: "essentieel",
        definiteLabel: "het essentieel",
      },
    },
  },
  1256: {
    2: {
      fr: {
        label: "wake up",
        definiteLabel: "le wake up",
      },
      en: {
        label: "wake up",
        definiteLabel: "the wake up",
      },
      nl: {
        label: "wake up",
        definiteLabel: "de wake up",
      },
    },
    3: {
      fr: {
        label: "petit déjeuner",
        definiteLabel: "le petit déjeuner",
      },
      en: {
        label: "breakfast",
        definiteLabel: "the breakfast",
      },
      nl: {
        label: "ontbijt",
        definiteLabel: "het ontbijt",
      },
    },
  },
};

export const getCycleLabels = (cycle, language) => {
  const config =
    ORGANIZATION_CYCLE_LABEL_CONFIGS[cycle.client]?.[cycle.type]?.[language] ??
    ORGANIZATION_CYCLE_LABEL_CONFIGS["default"]?.[cycle.type]?.[language];

  return {
    cycleLabel: config?.label,
    buyCycleLabel: I18N[language]["buyCycle"].replace(
      "{{definiteLabel}}",
      config?.definiteLabel
    ),
  };
};
