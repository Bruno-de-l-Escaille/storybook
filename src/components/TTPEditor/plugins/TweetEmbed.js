const I18N = {
  en: {
    quote_add: "Add",
  },
  fr: {
    quote_add: "Ajouter",
  },
  nl: {
    quote_add: "Toevoegen",
  },
};

const TweetEmbed = {
  // @Required
  // plugin name
  name: "tweet_embed",

  // @Required
  // data display
  display: "submenu",

  title: "Twitter embed",
  buttonClass: "",
  innerHTML:
    '<svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9311 1.90534C12.4811 2.11436 11.9971 2.25574 11.4895 2.31888C12.0078 1.99358 12.4055 1.47886 12.5933 0.864525C12.1083 1.16591 11.5709 1.38454 10.9995 1.50239C10.5417 0.991588 9.88939 0.672363 9.1671 0.672363C7.78129 0.672363 6.65733 1.84985 6.65733 3.30165C6.65733 3.50773 6.6796 3.70833 6.72265 3.90088C4.63682 3.79127 2.78739 2.74458 1.54944 1.15336C1.33344 1.5416 1.20954 1.99358 1.20954 2.47535C1.20954 3.38734 1.65294 4.19246 2.32601 4.66384C1.91479 4.65031 1.52754 4.53208 1.18932 4.33462C1.18913 4.3458 1.18913 4.35697 1.18913 4.36795C1.18913 5.64191 2.05461 6.70449 3.20253 6.94587C2.99215 7.00626 2.76998 7.03822 2.54144 7.03822C2.37935 7.03822 2.22232 7.02195 2.06921 6.99136C2.38852 8.0357 3.31521 8.79592 4.41371 8.81729C3.5546 9.5226 2.47256 9.94281 1.29638 9.94281C1.09424 9.94281 0.893966 9.93046 0.697998 9.90594C1.80811 10.6522 3.12766 11.0873 4.54492 11.0873C9.1613 11.0873 11.6859 7.08097 11.6859 3.60617C11.6859 3.49224 11.6834 3.37871 11.6786 3.26616C12.1693 2.89556 12.5948 2.43261 12.9311 1.90534Z" fill="currentColor"/></svg>',

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core, targetElement) {
    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const cloneCore = core;
    const context = core.context;
    context.tweetSubmenu = {
      targetButton: targetElement,
      textElement: null,
      currentSpan: null,
    };

    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu(core);

    // Input tag caching
    context.tweetSubmenu.textElement = listDiv.querySelector("input");

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
    listDiv.className = "se-submenu se-list-layer";
    listDiv.innerHTML = `
      <div class="se-list-inner" style="width: 230px;">
      <div class="se-form-group"><input class="se-input-form" type="text" placeholder="Insert tweet embed text" style="border: 1px solid #CCC;" /></div>
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
    this.context.tweetSubmenu.textElement.focus();
  },

  onClick: function () {
    const value = this.context.tweetSubmenu.textElement.value.trim();
    if (!value) return;

    const iframeDiv = document.createElement("DIV");
    iframeDiv.className = "__se__tweet";
    iframeDiv.setAttribute("contenteditable", false);
    iframeDiv.innerHTML = value;
    this.functions.insertHTML(iframeDiv);
    // if (window.twttr !== undefined) {
    // window.twttr.widgets.load(document.getElementById("ttp-editor"));
    // }
    this.context.tweetSubmenu.textElement.value = "";
    this.functions.insertHTML("<p><br/></p>");

    this.submenuOff();
  },
};

export default TweetEmbed;
