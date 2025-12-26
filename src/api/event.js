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
    "maxNumber",
    "contactFr",
    "contactNl",
    "contactEn",
    "emailContactFr",
    "emailContactNl",
    "emailContactEn",
    "phoneNumberContactFr",
    "phoneNumberContactNl",
    "phoneNumberContactEn",
    "tag",
    "slotIds",
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
export const getCarouselEventsTitels = async ({ apiUrl, token, language }) => {
  const fields = [
    "id",
    "nameFr",
    "nameEn",
    "nameNl",
    "carouselConfig",
    "startDateTime",
    "endDateTime",
  ];
  const requestUrl = `${apiUrl}/event/get-slider-entities`;

  try {
    const response = await axios.get(requestUrl, {
      params: {
        languages: language,
        access_token: token,
        fields: fields.join(","),
      },
    });

    const entities = response.data.data.entities.map((entity) => ({
      ...entity,
      carouselConfig: entity.carouselConfig
        ? JSON.parse(entity.carouselConfig)
        : null,
    }));

    return entities;
  } catch (error) {
    console.error("Error fetching carousel events:", error);
    return [];
  }
};

export const saveEventLight = ({ apiUrl, token, data }) => {
  const requestUrl = `${apiUrl}/event/event`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("nameFr", data.nameFr);
  formData.append("nameNl", data.nameNl);
  formData.append("nameEn", data.nameEn);
  formData.append("descriptionFr", data.descriptionFr);
  formData.append("descriptionNl", data.descriptionNl);
  formData.append("descriptionEn", data.descriptionEn);
  formData.append("client", data.client);
  formData.append("startDateTime", data.startDateTime);
  formData.append("endDateTime", data.endDateTime);
  formData.append("eventDate", data.eventDate);
  formData.append("placeFr", data.placeFr);
  formData.append("placeNl", data.placeNl);
  formData.append("placeEn", data.placeEn);
  formData.append("status", data.status);
  formData.append("maxNumber", data.maxPlaces);
  formData.append("labelFr", data.labelFr);
  formData.append("labelNl", data.labelNl);
  formData.append("labelEn", data.labelEn);
  formData.append("contactFr", data.contactFr);
  formData.append("contactNl", data.contactNl);
  formData.append("contactEn", data.contactEn);
  formData.append("emailContactFr", data.emailContactFr);
  formData.append("emailContactNl", data.emailContactNl);
  formData.append("emailContactEn", data.emailContactEn);
  formData.append("phoneNumberContactFr", data.phoneNumberContactFr);
  formData.append("phoneNumberContactNl", data.phoneNumberContactNl);
  formData.append("phoneNumberContactEn", data.phoneNumberContactEn);
  formData.append("type", data.type);
  formData.append("isVirtual", data.isVirtual);
  formData.append("urlBannerFr", data.urlBannerFr);
  formData.append("urlBannerNl", data.urlBannerNl);
  formData.append("urlBannerEn", data.urlBannerEn);
  formData.append("tag", JSON.stringify(data.tag));

  if (data.stages) {
    formData.append("stages", JSON.stringify(data.stages));
  }

  if (data.languages) {
    formData.append("languages", JSON.stringify(data.languages));
  }

  if (data.template) {
    formData.append("template", data.template);
  }

  if (data.eventId > 0) {
    formData.append("id", data.eventId);
  }

  if (data.slots && Array.isArray(data.slots)) {
    data.slots.forEach((slot, index) => {
      Object.keys(slot).forEach((key) => {
        const value =
          typeof slot[key] === "object" && slot[key] !== null
            ? JSON.stringify(slot[key])
            : slot[key];

        formData.append(`slots[${index}][${key}]`, value);
      });
    });
  }

  return axios.post(requestUrl, formData);
};

export const saveEventAuthor = ({ apiUrl, token, data }) => {
  const requestUrl = `${apiUrl}/event/event-author`;
  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("event", data.event);
  formData.append("author", data.author);
  formData.append("priority", data.priority);
  formData.append("isValid", data.isValid);

  return axios.post(requestUrl, formData);
};

export const deleteSpeaker = ({ apiUrl, token, eventId, authorId }) => {
  const requestUrl = `${apiUrl}/event/speaker/delete-author/${eventId}/${authorId}`;
  var formData = new FormData();
  formData.append("access_token", token);
  console.log("AAAA delete", eventId, authorId);
  return axios.post(requestUrl, formData);
};
