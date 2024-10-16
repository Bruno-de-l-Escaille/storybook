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
