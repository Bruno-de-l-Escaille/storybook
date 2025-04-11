import axios from "axios";

export const getEvent = ({ apiUrl, token, eventId }) => {
  const fields = [
    "id",
    "type",
    "nameFr",
    "nameNl",
    "nameEn",
    "placeFr",
    "placeNl",
    "placeEn",
    "descriptionFr",
    "descriptionNl",
    "descriptionEn",
    "urlBannerFr",
    "urlBannerNl",
    "urlBannerEn",
    "eventDate",
    "slotsCount",
    "client",
    "memberPrice",
    "nonMemberPrice",
    "languages",
    "isReplayable",
    "accreditationHours",
    "status",
    "replayStatus",
    "labelFr",
    "labelNl",
    "labelEn",
    "speakers-abstract",
    "user-registered",
    "eventCycles",
  ];
  const requestUrl = `${apiUrl}/event/event`;

  const filter = [{ property: "id", value: eventId, operator: "eq" }];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};

export const registerPremiumToEvent = ({ apiUrl, token, eventId, userId }) => {
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("event", eventId);
  formData.append("user", userId);
  formData.append("cycle", 56);
  const requestUrl = `${apiUrl}/event/guest/register/register_premium_event`;

  return axios.post(requestUrl, formData);
};

export const getEventWithTag = ({ apiUrl, token, eventId }) => {
  const fields = ["id", "nameFr", "nameEn", "nameNl", "tag"];
  const requestUrl = `${apiUrl}/event/event`;

  const filter = [{ property: "id", value: eventId, operator: "eq" }];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};

export const fetchTags = ({ apiUrl, token, inputTag, language = "fr" }) => {
  const fields = [
    "id",
    "nameFr",
    "nameEn",
    "nameNl",
    "sanitizedNameFr",
    "parent",
    "isSynonym",
    "isSuperTag",
    "superTag",
  ];
  const requestUrl = `${apiUrl}/blog/tag`;

  let filter;

  switch (language) {
    case "fr":
      filter = [{ property: "nameFr", value: inputTag, operator: "like" }];
      break;
    case "nl":
      filter = [{ property: "nameNl", value: inputTag, operator: "like" }];
      break;
    case "en":
      filter = [{ property: "nameEn", value: inputTag, operator: "like" }];
      break;
    default:
      break;
  }

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};

export const updateEventTags = ({
  apiUrl,
  token,
  eventId,
  updatedEventTags,
}) => {
  const requestUrl = `${apiUrl}/event/event`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("id", eventId);
  formData.append("tag", JSON.stringify(updatedEventTags));
  return axios.post(requestUrl, formData);
};

export const updateEventFocusConfig = ({
  apiUrl,
  token,
  eventId,
  updatedFocusConfig,
  updatedCarouselConfig,
}) => {
  const requestUrl = `${apiUrl}/event/event`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("id", eventId);
  formData.append("focusConfig", JSON.stringify(updatedFocusConfig));
  formData.append("carouselConfig", JSON.stringify(updatedCarouselConfig));
  return axios.post(requestUrl, formData);
};

export const updateCycleFocusConfig = ({
  apiUrl,
  token,
  cycleId,
  updatedFocusConfig,
  updatedCarouselConfig,
}) => {
  const requestUrl = `${apiUrl}/event/cycle`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("id", cycleId);
  formData.append("focusConfig", JSON.stringify(updatedFocusConfig));
  formData.append("carouselConfig", JSON.stringify(updatedCarouselConfig));
  return axios.post(requestUrl, formData);
};

export const updateEventWatchConfig = ({
  id,
  apiUrl,
  updatedWatchConfig,
  token,
}) => {
  const requestUrl = `${apiUrl}/event/event`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("id", id);
  formData.append("watchConfig", updatedWatchConfig);
  return axios.post(requestUrl, formData);
};
