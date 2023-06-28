import moment from "moment-timezone";
import "moment/locale/fr";
import "moment/locale/nl";

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
