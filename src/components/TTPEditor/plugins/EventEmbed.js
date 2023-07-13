import { getEvent } from "../../../api";
import { getApiUrl, getEventUrl, getDateLabel } from "../../../utils";
import { I18N } from "../../../i18n";

const addEvent = async (env, eventId, token) => {
  if (!eventId || !token) return;

  const apiUrl = getApiUrl(env);

  return getEvent({
    apiUrl,
    token,
    eventId,
  });
};

const renderEvent = (event, env, language) => {
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

  const appEnv = env === "rc2" ? "rc" : env;

  let speaker = null;
  let expertSpeaker = null;
  if (
    event["speakers-abstract"] &&
    event["speakers-abstract"].speakers &&
    event["speakers-abstract"].speakers.length > 0
  ) {
    const { firstName, lastName } = event["speakers-abstract"].speakers[0];
    speaker = `${firstName} ${lastName}`;
    expertSpeaker = event["speakers-abstract"].speakers[0];
  }

  let clientLogo = "";

  if (clientData && clientData.avatarUrl) {
    clientLogo = clientData.avatarUrl;
  }

  const imageSrc = `https://s3.tamtam.pro/${appEnv}${banner.replace(
    "eventsFolder",
    "events-folder"
  )}`;

  let str = `<div class="se-component se-event-embed" contenteditable="false" style="width:300px;font-size: 0.75rem;border-radius: 5px;padding: 0.688rem;background: #fff;color: #29394d;border: 1px solid #f1f2f4;outline: none;display: flex;flex-direction: column;">
    <div style="width: 100%;height: 8.75rem;background-size: cover;background-repeat: no-repeat;border-radius: 5px;display: flex;position: relative;background-image: url('${imageSrc}');">`;
  if (clientLogo) {
    str += `<div class="__se__tag" style="margin: 0.5rem;width: 3.5rem;height: 2.25rem;background-color: rgba(255, 255, 255, 0.85);border: 1px solid #f1f2f4;border-radius: 5px;padding: 0.2rem;"><span style="background-size: contain;background-repeat: no-repeat;background-position: center;width: 100%;height: 100%;display: flex;background-image: url('${clientLogo}');"></span></div>`;
  }
  str += `</div><h3 style="font-size: 1rem;font-weight: 500;height: 2.75rem;line-height:21px;overflow: hidden;margin: 0.75rem 0 0.25rem !important;text-align: left;">${desc}</h3>`;
  if (speaker) {
    str += `<h4 style="font-size: 0.75rem;color: #6d7f92;margin: 0 0 0.829rem !important;font-weight: 400;">${speaker}</h4>`;
  }
  str += `<ul style="padding-inline-start:10px;font-size: 0.75rem;margin-block-start:0;margin-block-end:0;">`;
  if (processing) {
    str += `<li>${I18N[language]["In progress"]}</li>`;
  } else {
    str += `<li><strong>${I18N[language]["En Live"]}</strong> : ${helpDate}</li>`;
  }
  if (isReplayable && isReplayable === 1) {
    str += `<li>${I18N[language]["Possible to review the training for max 15 days after the date of the live"]}</li>`;
  }
  str += `<li>${I18N[language]["Certificate included approved by"]} <strong>${clientData.abbreviation}</strong></li>`;
  str += `</ul>`;

  // prettier-ignore
  str += `<a style="height: 2rem;display: flex;align-items: center;justify-content: center;font-weight: 500;border-radius: 5px;color: #6d7f92 !important;background-color: #f1f2f4;text-decoration: none;margin: 20px 0;" href="${getEventUrl(env)}/event/${event.id}" target="_blank">${I18N[language]["Details"]}</a>`;
  str += `</div>`;
  return str;
};

const EventEmbed = {
  // @Required
  // plugin name
  name: "event_embed",
  // @Required
  // data display
  display: "submenu",

  title: "Event embed",
  buttonClass: "",
  // innerHTML:'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M18.4592 12.5639C18.1841 12.5639 17.9611 12.7868 17.9611 13.062V17.4846C17.9601 18.3096 17.2918 18.9781 16.4668 18.9789H2.49051C1.66553 18.9781 0.997172 18.3096 0.9962 17.4846V4.5045C0.997172 3.67971 1.66553 3.01116 2.49051 3.01018H6.91313C7.18825 3.01018 7.41123 2.78721 7.41123 2.51208C7.41123 2.23715 7.18825 2.01398 6.91313 2.01398H2.49051C1.11567 2.01553 0.00154894 3.12965 -7.62939e-06 4.5045V17.4848C0.00154894 18.8596 1.11567 19.9737 2.49051 19.9753H16.4668C17.8416 19.9737 18.9558 18.8596 18.9573 17.4848V13.062C18.9573 12.7868 18.7343 12.5639 18.4592 12.5639Z" fill="currentColor"/><path d="M9.45917 0.972284C8.8053 1.63638 8.81354 2.7048 9.47757 3.35873L16.2186 9.99717C16.2648 10.0427 16.3219 10.0753 16.3844 10.0921L19.567 10.9474C19.6975 10.9826 19.8367 10.9447 19.9316 10.8485C20.0263 10.7521 20.062 10.6124 20.025 10.4824L19.1207 7.3131C19.1029 7.25083 19.0694 7.19425 19.0232 7.14876L12.282 0.510463C11.6175 -0.14244 10.5501 -0.134208 9.89576 0.528865L9.45917 0.972284ZM16.456 9.17823L10.9389 3.74518L12.6909 1.96575L18.2081 7.39895L16.456 9.17823ZM17.1665 9.5255L18.5664 8.10387L19.122 10.0511L17.1665 9.5255ZM11.7559 1.04481L12.1566 1.43943L10.4044 3.21901L10.0037 2.82424C9.63485 2.46101 9.63027 1.86747 9.99347 1.4986L10.4301 1.05503C10.7937 0.68674 11.3867 0.682166 11.7559 1.04481Z" fill="currentColor"/><path d="M13.5 13.6667V12.25C13.5 9.90279 11.5972 8 9.25 8C6.90279 8 5 9.90279 5 12.25C5 14.5972 6.90279 16.5 9.25 16.5C9.4456 16.5 9.60415 16.3415 9.60415 16.1458C9.60415 15.9502 9.4456 15.7917 9.25 15.7917C7.294 15.7917 5.70835 14.206 5.70835 12.25C5.70835 10.294 7.294 8.70839 9.25 8.70839C11.206 8.70839 12.7916 10.294 12.7916 12.25V13.6667C12.7916 14.0579 12.4745 14.375 12.0833 14.375C11.6921 14.375 11.375 14.0579 11.375 13.6667V12.25C11.375 12.0544 11.2164 11.8959 11.0208 11.8959C10.8252 11.8959 10.6666 12.0544 10.6666 12.25C10.6666 13.0324 10.0324 13.6667 9.25 13.6667C8.46761 13.6667 7.83335 13.0324 7.83335 12.25C7.83335 11.4677 8.46761 10.8334 9.25 10.8334C9.4456 10.8334 9.60415 10.6748 9.60415 10.4792C9.60415 10.2836 9.4456 10.1251 9.25 10.1251C8.29894 10.123 7.46226 10.753 7.20161 11.6677C6.94097 12.5824 7.31978 13.5588 8.1291 14.0584C8.93843 14.5579 9.98109 14.4589 10.6819 13.8159C10.759 14.5648 11.41 15.1217 12.1619 15.0819C12.9138 15.0421 13.5024 14.4196 13.5 13.6667Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/></g><defs><clipPath id="clip0"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>',
  innerHTML:
    '<svg width="20" height="19" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_43368_8850)"><path d="M9.51759 7.1875C9.86385 7.1875 10.1445 6.90768 10.1445 6.5625C10.1445 6.21732 9.86385 5.9375 9.51759 5.9375C9.17133 5.9375 8.89062 6.21732 8.89062 6.5625C8.89062 6.90768 9.17133 7.1875 9.51759 7.1875Z" fill="currentColor"/><path d="M9.51759 9.90625C9.86385 9.90625 10.1445 9.62643 10.1445 9.28125C10.1445 8.93607 9.86385 8.65625 9.51759 8.65625C9.17133 8.65625 8.89062 8.93607 8.89062 9.28125C8.89062 9.62643 9.17133 9.90625 9.51759 9.90625Z" fill="currentColor"/><path d="M12.2441 7.1875C12.5904 7.1875 12.8711 6.90768 12.8711 6.5625C12.8711 6.21732 12.5904 5.9375 12.2441 5.9375C11.8979 5.9375 11.6172 6.21732 11.6172 6.5625C11.6172 6.90768 11.8979 7.1875 12.2441 7.1875Z" fill="currentColor"/><path d="M15.5678 7.81249C15.9141 7.81249 16.1948 7.53267 16.1948 7.18749V3.74999C16.1948 2.3715 15.0697 1.25 13.6869 1.25H12.8719V0.624999C12.8719 0.279812 12.5912 0 12.2449 0C11.8986 0 11.6179 0.279812 11.6179 0.624999V1.25H8.76526V0.624999C8.76526 0.279812 8.48457 0 8.1383 0C7.79203 0 7.51134 0.279812 7.51134 0.624999V1.25H4.69001V0.624999C4.69001 0.279812 4.40932 0 4.06305 0C3.71677 0 3.43608 0.279812 3.43608 0.624999V1.25H2.65238C1.26955 1.25 0.144531 2.3715 0.144531 3.74999V13.5C0.144531 14.8785 1.26955 16 2.65238 16H10.5521C10.5735 16 10.5945 15.9989 10.6153 15.9968C10.636 15.9988 10.6567 16 10.6773 16C10.8445 16 11.0086 15.9333 11.1291 15.8085L16.0194 10.746C16.1938 10.5654 16.2432 10.2985 16.1448 10.0679C16.0464 9.83723 15.8192 9.68748 15.5678 9.68748H12.5584C11.1756 9.68748 10.0505 10.809 10.0505 12.1875V14.75H2.65238C1.96097 14.75 1.39846 14.1892 1.39846 13.5V3.74999C1.39846 3.06074 1.96097 2.5 2.65238 2.5H3.43608V3.12499C3.43608 3.47018 3.71677 3.74999 4.06305 3.74999C4.40932 3.74999 4.69001 3.47018 4.69001 3.12499V2.5H7.51134V3.12499C7.51134 3.47018 7.79203 3.74999 8.1383 3.74999C8.48457 3.74999 8.76526 3.47018 8.76526 3.12499V2.5H11.6179V3.12499C11.6179 3.47018 11.8986 3.74999 12.2449 3.74999C12.5912 3.74999 12.8719 3.47018 12.8719 3.12499V2.5H13.6869C14.3783 2.5 14.9408 3.06074 14.9408 3.74999V7.18749C14.9408 7.53267 15.2215 7.81249 15.5678 7.81249ZM11.3045 12.1875C11.3045 11.4982 11.867 10.9375 12.5584 10.9375H14.0937L11.3045 13.8249V12.1875Z" fill="currentColor"/><path d="M4.06251 7.1875C4.40877 7.1875 4.68947 6.90768 4.68947 6.5625C4.68947 6.21732 4.40877 5.9375 4.06251 5.9375C3.71625 5.9375 3.43555 6.21732 3.43555 6.5625C3.43555 6.90768 3.71625 7.1875 4.06251 7.1875Z" fill="currentColor"/><path d="M6.79102 9.90625C7.13729 9.90625 7.41799 9.62643 7.41799 9.28125C7.41799 8.93607 7.13729 8.65625 6.79102 8.65625C6.44476 8.65625 6.16406 8.93607 6.16406 9.28125C6.16406 9.62643 6.44476 9.90625 6.79102 9.90625Z" fill="currentColor"/><path d="M4.06251 12.625C4.40877 12.625 4.68947 12.3452 4.68947 12C4.68947 11.6548 4.40877 11.375 4.06251 11.375C3.71625 11.375 3.43555 11.6548 3.43555 12C3.43555 12.3452 3.71625 12.625 4.06251 12.625Z" fill="currentColor"/><path d="M4.06251 9.90625C4.40877 9.90625 4.68947 9.62643 4.68947 9.28125C4.68947 8.93607 4.40877 8.65625 4.06251 8.65625C3.71625 8.65625 3.43555 8.93607 3.43555 9.28125C3.43555 9.62643 3.71625 9.90625 4.06251 9.90625Z" fill="currentColor"/><path d="M6.79102 12.625C7.13729 12.625 7.41799 12.3452 7.41799 12C7.41799 11.6548 7.13729 11.375 6.79102 11.375C6.44476 11.375 6.16406 11.6548 6.16406 12C6.16406 12.3452 6.44476 12.625 6.79102 12.625Z" fill="currentColor"/><path d="M6.79102 7.1875C7.13729 7.1875 7.41799 6.90768 7.41799 6.5625C7.41799 6.21732 7.13729 5.9375 6.79102 5.9375C6.44476 5.9375 6.16406 6.21732 6.16406 6.5625C6.16406 6.90768 6.44476 7.1875 6.79102 7.1875Z" fill="currentColor"/></g><defs><clipPath id="clip0_43368_8850"><rect width="16.0503" height="16" fill="white" transform="translate(0.144531)"/></clipPath></defs></svg>',
  // Store params like token, env
  initParams: function (context, auth, env, language) {
    context.params = {
      auth: auth,
      env: env,
      language: language,
    };
  },
  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core, targetElement) {
    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context;
    context.eventSubmenu = {
      targetButton: targetElement,
      textElement: null,
      currentSpan: null,
    };

    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu(core);

    // Input tag caching
    context.eventSubmenu.textElement = listDiv.querySelector("input");

    // You must bind "core" object when registering an event.
    /** add event listeners */
    listDiv
      .querySelector(".se-plugin-btn")
      .addEventListener("click", this.onClick.bind(core));

    // @Required
    // You must add the "submenu" element using the "core.initMenuTarget" method.
    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);
  },

  /**
   * @Override core - managedTagsInfo
   */
  managedTags: function () {
    return {
      className: "se-event-embed",
      method: function (element) {
        element.setAttribute("contenteditable", false);
      },
    };
  },

  setSubmenu: function (core) {
    const listDiv = core.util.createElement("DIV");

    // @Required
    // A "se-submenu" class is required for the top level element.
    listDiv.className = "se-submenu se-list-layer";
    listDiv.innerHTML = `
      <div class="se-list-inner">
      <ul class="se-list-basic" style="width: 230px;">
      <li>
      <div class="se-form-group"><input class="se-input-form" type="text" placeholder="Event ID" style="border: 1px solid #CCC;" /></div>
      <div class="se-form-group"><button type="button" class="se-plugin-btn se-tooltip">${
        I18N[core.lang.code]["add"]
      }</button></div>
      </li>
      </ul>
      </div>`;

    return listDiv;
  },

  // @Override submenu
  // Called after the submenu has been rendered
  on: function () {
    this.context.eventSubmenu.textElement.focus();
  },

  onClick: async function () {
    const eventId = this.context.eventSubmenu.textElement.value.trim();
    if (!eventId) return;

    if (!this.context.params) return;

    const token = this.context.params.auth.token;
    const language = this.context.params.language;
    const env = this.context.params.env;

    if (!token) return;

    this.functions.core.showLoading();

    try {
      const response = await addEvent(env, eventId, token);
      this.functions.core.closeLoading();
      const event = response.data.data[0];
      const eventTmpl = renderEvent(event, env, language);
      this.functions.insertHTML(eventTmpl, true);
      this.context.eventSubmenu.textElement.value = "";
      this.submenuOff();
    } catch (e) {
      this.functions.core.closeLoading();
    }
  },
};

export default EventEmbed;
