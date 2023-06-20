const I18N = {
  en: {
    quote_add: "Add",
    quote_text: '"Insert quote text"',
    quote_author: '"Insert quote author"',
  },
  fr: {
    quote_add: "Ajouter",
    quote_text: "Insérer le texte de la citation",
    quote_author: "Insérer l'auteur de la citation",
  },
  nl: {
    quote_add: "Toevoegen",
    quote_text: '"Citaattekst invoegen"',
    quote_author: '"Voeg de auteur van de bronvermelding in"',
  },
};

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
          I18N[core.lang.code]["quote_add"]
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

    let html = `<blockquote class="ttp-quote"><p>${value}</p>`;
    if (authorValue) {
      html += `<span class="author">--${authorValue}</span>`;
    }
    html += "</blockquote><p><br /></p>";
    this.functions.insertHTML(html, true);
    this.context.quoteSubmenu.textElement.value = "";
    this.context.quoteSubmenu.authorTextElement.value = "";

    this.submenuOff();
  },
};

export default QuoteEmbed;
