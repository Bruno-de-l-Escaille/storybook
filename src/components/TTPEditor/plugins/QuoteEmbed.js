import { I18N } from "../../../i18n";

const QuoteEmbed = {
  // @Required
  // plugin name
  name: "quote_embed",

  // @Required
  // data display
  display: "submenu",
  title: "Quote embed",
  buttonClass: "",
  innerHTML:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor"d="M19.092 6.863c-1.504 2.31-1.779 4.45-1.681 5.688 6.132-.101 5.696 6.449 1.39 6.449-1.83 0-3.801-1.338-3.801-4.275 0-2.724 1.412-5.845 4.092-7.862zm-13 0c-1.504 2.31-1.779 4.45-1.681 5.688 6.132-.101 5.696 6.449 1.39 6.449-1.83 0-3.801-1.338-3.801-4.275 0-2.724 1.412-5.845 4.092-7.862zm16.908-3.863c-6.108 1.206-10 6.584-10 11.725 0 3.97 2.786 6.275 5.801 6.275 2.615 0 5.199-1.797 5.199-4.979 0-2.601-1.905-4.757-4.396-5.149.217-2.004 2.165-4.911 4.38-5.746l-.984-2.126zm-13 0c-6.108 1.206-10 6.584-10 11.725 0 3.97 2.786 6.275 5.801 6.275 2.615 0 5.199-1.797 5.199-4.979 0-2.601-1.905-4.757-4.396-5.149.217-2.004 2.165-4.911 4.38-5.746l-.984-2.126z"/></svg>',

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core, targetElement) {
    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context;
    context.quoteSubmenu = {
      targetButton: targetElement,
      textElement: null,
      authorTextElement: null,
      currentSpan: null,
    };

    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu(core);

    // Input tag caching
    context.quoteSubmenu.textElement = listDiv.querySelector("textarea");
    context.quoteSubmenu.authorTextElement = listDiv.querySelector(
      "input[name = 'author']"
    );

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

  setSubmenu: function (core) {
    const listDiv = core.util.createElement("DIV");
    // @Required
    // A "se-submenu" class is required for the top level element.
    listDiv.className = "se-submenu se-list-layer se-custom-quote";
    const styles =
      "width: 100%;color: #fff;background: #18a0fb linear-gradient(180deg, #3baefc, #18a0fb) repeat-x;border-color: #18a0fb;box-shadow: 0 1px 0 rgb(255 255 255 / 15%), 0 1px 1px rgb(0 0 0 / 8%);";
    listDiv.innerHTML = `
      <div class="se-list-inner" style="width: 100%;">
      <div class="se-form-group">
      <textarea class="se-input-form" type="text" style="padding: 5px;border: 1px solid #CCC; width: 100%" placeholder="${
        I18N[core.lang.code]["quote_text"]
      }" ></textarea>
      </div>
      <div class="se-form-group">
      <input class="se-input-form" name="author" type="text" placeholder="${
        I18N[core.lang.code]["quote_author"]
      }" />
      </div>
      <div class="se-form-group">
        <button type="button" class="se-plugin-btn se-tooltip">${
          I18N[core.lang.code]["add"]
        }</button>
      </div>
      </div>`;

    return listDiv;
  },

  // @Override submenu
  // Called after the submenu has been rendered
  on: function () {
    this.context.quoteSubmenu.textElement.focus();
  },

  onClick: function () {
    const value = this.context.quoteSubmenu.textElement.value.trim();
    const authorValue = this.context.quoteSubmenu.authorTextElement.value.trim();
    if (!value) return;

    let html = `<style>.ttp-quote:before{content: "";background-image: url("data:image/svg+xml,%3Csvg width='54' height='38' viewBox='0 0 54 38' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.4463 19.375C20.5289 21.4778 21.5702 24.0311 21.5702 27.0351C21.5702 30.039 20.5289 32.6425 18.4463 34.8454C16.3636 36.9481 13.8347 37.9995 10.8595 37.9995C7.8843 37.9995 5.30579 36.9481 3.12397 34.8454C1.04132 32.6425 0 30.039 0 27.0351C0 22.1286 2.13223 16.9718 6.3967 11.5647C10.4855 6.49816 16.1417 2.7943 23.3651 0.453128C24.2041 0.181218 25.1024 0.610679 25.447 1.42249C25.8434 2.35632 25.3594 3.42728 24.4097 3.78384C20.6999 5.1766 17.4724 6.86904 14.7273 8.86117C11.6529 11.0641 9.66942 12.9165 8.77686 14.4185C8.34935 15.1858 9.2348 16.2919 10.1118 16.2416C10.3525 16.2278 10.6017 16.2209 10.8595 16.2209C13.8347 16.2209 16.3636 17.2722 18.4463 19.375ZM46.2645 19.375C48.3471 21.4778 49.3884 24.0311 49.3884 27.0351C49.3884 30.039 48.3471 32.6425 46.2645 34.8454C44.1818 36.9481 41.6529 37.9995 38.6777 37.9995C35.7025 37.9995 33.124 36.9481 30.9421 34.8454C28.8595 32.6425 27.8182 30.039 27.8182 27.0351C27.8182 22.1286 29.9504 16.9718 34.2149 11.5647C38.3037 6.49816 43.9598 2.7943 51.1833 0.453128C52.0223 0.181218 52.9206 0.610679 53.2652 1.42249C53.6616 2.35632 53.1776 3.42728 52.2278 3.78385C48.5181 5.1766 45.2906 6.86904 42.5455 8.86117C39.4711 11.0641 37.4876 12.9165 36.595 14.4185C36.1675 15.1858 37.053 16.2919 37.93 16.2416C38.1706 16.2278 38.4199 16.2209 38.6777 16.2209C41.6529 16.2209 44.1818 17.2722 46.2645 19.375Z' fill='%236D7F92' fill-opacity='0.2'/%3E%3C/svg%3E%0A");width: 54px;height: 38px;position: absolute;left: 20px;top: 20%;}</style><blockquote class="ttp-quote" style="position: relative;font-style: italic;font-weight: 300;font-size: 18px;line-height: 25px;color: #6d7f92;border: none !important;padding-left: 100px !important;"><p>${value}</p>`;
    if (authorValue) {
      html += `<span style="display: block;font-style: normal;font-size: 12px;text-transform: uppercase;">--${authorValue}</span>`;
    }
    html += "</blockquote><p><br /></p>";
    this.functions.insertHTML(html, true);
    this.context.quoteSubmenu.textElement.value = "";
    this.context.quoteSubmenu.authorTextElement.value = "";

    this.submenuOff();
  },
};

export default QuoteEmbed;
