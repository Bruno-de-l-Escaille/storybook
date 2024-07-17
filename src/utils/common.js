import moment from "moment-timezone";
import "moment/locale/fr";
import "moment/locale/nl";
import { I18N } from "../i18n";
import { toast } from "react-toastify";

const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function addLandaSize(img, width = 0, height = 0) {
  if (!img) {
    return "";
  }
  let result = img;
  let found = false;

  const splt = img.split(".");
  const ext = splt[splt.length - 1];

  if (width > 0) {
    result += `/w${width}`;
    found = true;
  }
  if (height > 0) {
    const sep = width > 0 ? "-" : "/";
    result += `${sep}h${height}`;
    found = true;
  }
  result += found ? "-noEnlarge" : "/noEnlarge";

  return `${result}.${ext}`.replace(
    "https://s3.eu-west-1.amazonaws.com/tamtam",
    "https://s3.tamtam.pro"
  );
}

function extractFirstLettre(arrayStr, length) {
  let result = "";
  for (let i = 0; i < arrayStr.length; i++) {
    if (arrayStr[i] != undefined) {
      result += arrayStr[i].substring(0, 1);
    }
  }
  return result.toUpperCase();
}

export const getUserNameForAvatar = (firstName = "", lastName = "") => {
  let fName = firstName.split(" ");
  if (fName.length >= 3) {
    return extractFirstLettre(fName, 3);
  } else {
    let lName = lastName.split(" ");
    return extractFirstLettre(fName.concat(lName), 3);
  }
};

export const truncateWithHTML = (string, length, max = 10) => {
  const noHTML = string.replace(/<[^>]*>/g, "");

  // if the string does not need to be truncated
  if (noHTML.length <= max) {
    return string;
  }

  // if the string does not contains tags
  if (noHTML.length === string.length) {
    // add <span title=""> to allow complete string to appear on hover
    return `<span title="${string}">${string.substring(0, max).trim()}…</span>`;
  }

  const substrings = string.split(/(<[^>]*>)/g).filter(Boolean);
  // substrings = ["<span class='className'>","My long string that","</span>"," I want shorter","<span>"," but just a little bit","</span>"]

  let count = 0;
  let truncated = [];
  for (let i = 0; i < substrings.length; i++) {
    let substr = substrings[i];
    // if the substring isn't an HTML tag
    if (!substr.startsWith("<")) {
      if (count > length) {
        continue;
      } else if (substr.length > length - count - 1) {
        truncated.push(substr.substring(0, length - count - 1) + "…");
      } else {
        truncated.push(substr);
      }
      count += substr.length;
    } else {
      truncated.push(substr);
    }
  }

  return `<span title="${noHTML}">${truncated.join("")}…</span>`;
};

export const getApiUrl = (env) => {
  let apiUrl = "";
  switch (env) {
    case "local":
      apiUrl = "http://local.api.tamtam.pro";
      break;
    case "rc2":
      apiUrl = "https://api.rc2.tamtam.pro";
      break;
    case "staging":
      apiUrl = "https://api.staging.tamtam.pro";
      break;
    default:
      apiUrl = "https://api.tamtam.pro";
      break;
  }
  return apiUrl;
};

export const getEventUrl = (env) => {
  let eventUrl = "";
  switch (env) {
    case "local":
      eventUrl = "http://local.portal.event.tamtam.pro:3005";
      break;
    case "rc2":
      eventUrl = "https://rc2.offfcourse.be";
      break;
    case "staging":
      eventUrl = "https://staging.offfcourse.be";
      break;
    default:
      eventUrl = "https://offfcourse.be";
      break;
  }
  return eventUrl;
};

export const getDateLabel = (date) => {
  const d = new Date(date);

  const result = d.toDateString().split(" ");

  const hours =
    parseInt(d.getHours(), 10) < 10 ? "0" + d.getHours() : d.getHours();
  const minutes =
    parseInt(d.getMinutes(), 10) < 10 ? "0" + d.getMinutes() : d.getMinutes();

  return (
    result[2] +
    " " +
    result[1] +
    " " +
    result[3] +
    ", at " +
    hours +
    ":" +
    minutes
  );
};

/**
 * Convert a date from UTC to client Timezone
 *
 * @param date string
 * @param srcFormat string
 * @param destFormat string
 *
 * @return string formatted local date (in destFormat format)
 */
export function convertDateFromUTC(
  date,
  language,
  srcFormat = API_DATE_FORMAT,
  destFormat = API_DATE_FORMAT
) {
  if (!date) {
    return "";
  }

  var offsetMinutes = new Date().getTimezoneOffset();
  return moment(date, [srcFormat])
    .locale(language)
    .subtract(offsetMinutes, "minutes")
    .format(destFormat);
}

export function getTagName(tag, currentLanguage) {
  let languages = ["nameFr", "nameNl", "nameEn"].filter(
    (e) => e !== currentLanguage
  );

  for (let i = 0; i < languages.length; i++) {
    let lng = languages[i];

    if (tag[lng] != null && tag[lng].trim() !== "") {
      return tag[lng];
    }
  }
  return "";
}

export const isEmpty = (value) => {
  if (Array.isArray(value) || typeof value === "string") {
    return value.length === 0;
  }
  if (typeof value === "object" && value !== null) {
    return Object.keys(value).length === 0;
  }
  return !value;
};

export const getKeyByLanguage = (key, language) =>
  `${key}${language?.charAt(0).toUpperCase()}${language
    ?.slice(1)
    .toLowerCase()}`;

export const getByLanguage = (resource, property, language, strict = false) => {
  if (!resource || typeof resource !== "object") {
    return "";
  }
  const value = resource[getKeyByLanguage(property, language)];

  if (!isEmpty(value)) {
    return value;
  }

  if (strict) {
    return undefined;
  }

  let result;
  ["Fr", "Nl", "En"].forEach((lng) => {
    const val = resource[`${property}${lng}`];
    if (!isEmpty(val)) {
      result = val;
    }
  });

  return result === undefined ? undefined : result;
};

export const getCroppedImageUrl = (
  imageUrl,
  width = 0,
  height = 0,
  optimize = true
) => {
  if (isEmpty(imageUrl) || (!width && !height)) {
    return "";
  }

  // Todo use webp when it supported by landa
  const extension = optimize ? "jpg" : imageUrl.split(".").pop();
  const options = [];

  if (width) {
    options.push(`w${width}`);
  }

  if (height) {
    options.push(`h${height}`);
  }

  return `${imageUrl}/${options.join("-")}-noEnlarge.${extension}`;
};

export function isUrl(str) {
  const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  return regexp.test(str);
}

export const trimUrlSlashes = (url) => url.replace(/^\/+|\/+$/g, "");

export const prepareS3ResourceUrl = (
  baseS3Url,
  urlPath,
  appendEventsFolder = true
) => {
  if (isUrl(urlPath ?? "")) return urlPath;
  if (isEmpty(baseS3Url) || isEmpty(urlPath) || !baseS3Url || !urlPath)
    return "";

  const base = trimUrlSlashes(baseS3Url);
  const path = trimUrlSlashes(urlPath).replace("eventsFolder", "events-folder");
  const pathPrefix =
    appendEventsFolder && path.split("/")[0] !== "events-folder"
      ? "events-folder"
      : "";

  return `${base}${isEmpty(pathPrefix) ? "/" : `/${pathPrefix}/`}${path}`;
};

export const parseJson = (value) => {
  if (!isEmpty(value) && value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return undefined;
    }
  }

  return undefined;
};

export const getNotNullLanguages = (resource, property) => {
  if (!resource || typeof resource !== "object") {
    return [];
  }
  const values = [];

  const valueFr = resource[`${property}Fr`];
  const valueNl = resource[`${property}Nl`];
  const valueEn = resource[`${property}En`];

  if (!isEmpty(valueFr)) {
    values.push("fr");
  }

  if (!isEmpty(valueNl)) {
    values.push("nl");
  }

  if (!isEmpty(valueEn)) {
    values.push("en");
  }

  return values;
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const appendParamsToLink = (link, params) => {
  if (!link || isEmpty(link)) {
    return link;
  }

  try {
    const url = new URL(link);
    params.forEach((param) => {
      url.searchParams.set(param[0], param[1]);
    });
    return url.toString();
  } catch (err) {
    return link;
  }
};

export const onError = (language, resp, message, autoClose) => {
  if (!message) {
    message = I18N[language]["Error occured"];
  }

  const errorMessage = message;

  if (typeof autoClose === "boolean") {
    toast.error(errorMessage, {
      autoClose: false,
    });
  } else {
    toast.error(errorMessage);
  }
};

export const stopPropagation = (e) => {
  e.stopPropagation();
};

export const startCase = (str) => {
  if (!str) return "";

  const words = str.split(" ");
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1).toLowerCase();
    return `${firstLetter}${restOfWord}`;
  });

  return capitalizedWords.join(" ");
};

// this function capitalize the first letter and after each space
export const capFirstLetterInSentence = (sentence) => {
  const sentenceToLowerCase = sentence?.toLowerCase() ?? "";
  return startCase(sentenceToLowerCase);
};

export const parseBoolean = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  switch (value) {
    case "false":
      return false;
    case "0":
      return false;
    case 0:
      return false;
    case "true":
      return true;
    case "1":
      return true;
    case 1:
      return true;
    default:
      return value === true;
  }
};
