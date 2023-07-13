import { getArticle } from "../../../api";
import { getApiUrl, getArticleFullUrl } from "../../../utils";
import { I18N } from "../../../i18n";

const addArticle = async (env, articleId, token) => {
  if (!articleId || !token) return;

  const apiUrl = getApiUrl(env);

  return getArticle({
    apiUrl,
    token,
    articleId,
  });
};

function getImageFromMedia(media) {
  let image = null;

  if (media.fullCroppedWebPath) {
    image = media.fullCroppedWebPath;
  } else if (media.fullMediaUrl) {
    image = media.fullMediaUrl;
  } else if (media.webPath) {
    image = media.webPath;
  }

  return image;
}

const renderArticle = (article, lng) => {
  const {
    title,
    organization,
    category,
    main_media,
    albums,
    isExternal,
  } = article;
  const categoryName = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const currentArticleUrl = getArticleFullUrl(article);

  let imageSrc = "/img/article-cover-small.jpg";
  if (
    albums &&
    albums.length > 0 &&
    albums[0].medias &&
    albums[0].medias.length > 0
  ) {
    let albumImage = getImageFromMedia(albums[0].medias[0]);
    imageSrc = albumImage || imageSrc;
  } else if (main_media) {
    let mainMediaImage = getImageFromMedia(main_media);
    imageSrc = mainMediaImage || imageSrc;
  }

  // prettier-ignore
  let str = `<div class="__se__tag" style="background-image: url('${imageSrc}');display: block;position: relative;color: transparent;background-color: #eee;background-position: center;background-size: cover;background-repeat: no-repeat;height: 220px;width: 40%;border-radius: 8px 0 0 8px;"></div><div style="position: relative;height: 220px;width: 60%;background-color: #ffffff;padding: 1rem !important;display: flex !important;flex-direction: column;justify-content: center;margin: 0 !important;"><span style="font-size: 12px;letter-spacing: 0.02em;position: absolute;top: 0;right: 0;z-index: 1;padding: 4px 14px;margin-bottom: auto;margin-left: auto;background: #eee;border-radius: 2px 8px 2px 2px;background: ${category.colorCode};white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color: #ffffff;text-shadow: 0px 4px 4px rgba(41, 57, 77, 0.1);">${category[categoryName]}</span><span style="position: relative;z-index: 1;height: 20px;border-left: 3px solid #eee;border-left-color: ${category.colorCode};color: #3c4e64;padding-left: 6px;margin-top: 10px;margin-bottom: 20px;font-size: 14px;line-height: 20px;white-space: nowrap;max-width: 100%;overflow: hidden;text-overflow: ellipsis;">${organization.abbreviation}</span><a href="${currentArticleUrl}" target="_blank" ${isExternal ? 'rel="noreferrer"' : ""} style="margin-bottom: 20px;font-family: Roboto;max-height: 90px;overflow: hidden;text-overflow: ellipsis;display: block;display: -webkit-box;-webkit-line-clamp: 4;-webkit-box-orient: vertical;text-align: left;color: #29394d;font-weight: 500;font-size: 18px;line-height: 1.266;text-decoration: none !important;">${title}</a></div>`;

  // prettier-ignore
  return `<div class="se-component __se__uneditable" contenteditable="false" style="display: flex !important;width: 100%;box-shadow: 0px 4px 10px rgba(41, 57, 77, 0.1);margin-bottom: 10px !important;border-radius: 8px;border: none !important;outline: none !important;">${str}</div>`;
};

const ArticleEmbed = {
  // @Required
  // plugin name
  name: "article_embed",
  // @Required
  // data display
  display: "submenu",

  title: "Article embed",
  buttonClass: "",
  innerHTML:
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M18.4592 12.5639C18.1841 12.5639 17.9611 12.7868 17.9611 13.062V17.4846C17.9601 18.3096 17.2918 18.9781 16.4668 18.9789H2.49051C1.66553 18.9781 0.997172 18.3096 0.9962 17.4846V4.5045C0.997172 3.67971 1.66553 3.01116 2.49051 3.01018H6.91313C7.18825 3.01018 7.41123 2.78721 7.41123 2.51208C7.41123 2.23715 7.18825 2.01398 6.91313 2.01398H2.49051C1.11567 2.01553 0.00154894 3.12965 -7.62939e-06 4.5045V17.4848C0.00154894 18.8596 1.11567 19.9737 2.49051 19.9753H16.4668C17.8416 19.9737 18.9558 18.8596 18.9573 17.4848V13.062C18.9573 12.7868 18.7343 12.5639 18.4592 12.5639Z" fill="currentColor"/><path d="M9.45917 0.972284C8.8053 1.63638 8.81354 2.7048 9.47757 3.35873L16.2186 9.99717C16.2648 10.0427 16.3219 10.0753 16.3844 10.0921L19.567 10.9474C19.6975 10.9826 19.8367 10.9447 19.9316 10.8485C20.0263 10.7521 20.062 10.6124 20.025 10.4824L19.1207 7.3131C19.1029 7.25083 19.0694 7.19425 19.0232 7.14876L12.282 0.510463C11.6175 -0.14244 10.5501 -0.134208 9.89576 0.528865L9.45917 0.972284ZM16.456 9.17823L10.9389 3.74518L12.6909 1.96575L18.2081 7.39895L16.456 9.17823ZM17.1665 9.5255L18.5664 8.10387L19.122 10.0511L17.1665 9.5255ZM11.7559 1.04481L12.1566 1.43943L10.4044 3.21901L10.0037 2.82424C9.63485 2.46101 9.63027 1.86747 9.99347 1.4986L10.4301 1.05503C10.7937 0.68674 11.3867 0.682166 11.7559 1.04481Z" fill="currentColor"/><path d="M13.5 13.6667V12.25C13.5 9.90279 11.5972 8 9.25 8C6.90279 8 5 9.90279 5 12.25C5 14.5972 6.90279 16.5 9.25 16.5C9.4456 16.5 9.60415 16.3415 9.60415 16.1458C9.60415 15.9502 9.4456 15.7917 9.25 15.7917C7.294 15.7917 5.70835 14.206 5.70835 12.25C5.70835 10.294 7.294 8.70839 9.25 8.70839C11.206 8.70839 12.7916 10.294 12.7916 12.25V13.6667C12.7916 14.0579 12.4745 14.375 12.0833 14.375C11.6921 14.375 11.375 14.0579 11.375 13.6667V12.25C11.375 12.0544 11.2164 11.8959 11.0208 11.8959C10.8252 11.8959 10.6666 12.0544 10.6666 12.25C10.6666 13.0324 10.0324 13.6667 9.25 13.6667C8.46761 13.6667 7.83335 13.0324 7.83335 12.25C7.83335 11.4677 8.46761 10.8334 9.25 10.8334C9.4456 10.8334 9.60415 10.6748 9.60415 10.4792C9.60415 10.2836 9.4456 10.1251 9.25 10.1251C8.29894 10.123 7.46226 10.753 7.20161 11.6677C6.94097 12.5824 7.31978 13.5588 8.1291 14.0584C8.93843 14.5579 9.98109 14.4589 10.6819 13.8159C10.759 14.5648 11.41 15.1217 12.1619 15.0819C12.9138 15.0421 13.5024 14.4196 13.5 13.6667Z" fill="currentColor" stroke="currentColor" stroke-width="0.2"/></g><defs><clipPath id="clip0"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>',

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
    context.articleSubmenu = {
      targetButton: targetElement,
      textElement: null,
      currentSpan: null,
    };

    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu(core);

    // Input tag caching
    context.articleSubmenu.textElement = listDiv.querySelector("input");

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
      className: "se-article-embed",
      method: function (element) {
        if (!element.getAttribute("src")) return;
        let dataSrc = element.getAttribute("src");
        element.setAttribute("data-src", dataSrc);
        element.removeAttribute("src");
        element.innerHTML = decodeURIComponent(dataSrc);
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
      <div class="se-form-group"><input class="se-input-form" type="text" placeholder="Article URL" style="border: 1px solid #CCC;" /></div>
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
    this.context.articleSubmenu.textElement.focus();
  },

  onClick: async function () {
    const value = this.context.articleSubmenu.textElement.value.trim();
    if (!value) return;

    const url = value.split("?");
    const articleId = url[0].split("/").pop();
    if (!articleId) return;

    if (!this.context.params) return;

    const token = this.context.params.auth.token;
    const language = this.context.params.language;
    const env = this.context.params.env;

    if (!token) return;

    this.functions.core.showLoading();

    try {
      const response = await addArticle(env, articleId, token);
      this.functions.core.closeLoading();
      const article = response.data.data[0];
      const articleTmpl = renderArticle(article, language);
      this.functions.insertHTML(articleTmpl, true);
      this.context.articleSubmenu.textElement.value = "";
      this.submenuOff();
    } catch (e) {
      this.functions.core.closeLoading();
    }
  },
};

export default ArticleEmbed;
