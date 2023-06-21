const TTP_API_URL = "http://api.tamtam.pro";

const hasRelativePath = (organizationId, host) => {
  if (!host) return true;

  const hosts = {
    org_8: "be.accountants",
    org_9: "forumforthefuture.be",
    org_4: "degandpartners.com",
  };
  if (
    [8, 9, 4].includes(organizationId) &&
    !host.includes(hosts[`org_${organizationId}`])
  ) {
    return false;
  }

  if (host && host.includes("blog.")) return true;

  return false;
};
export const getArticleFullUrl = (article, env = "", host) => {
  let baBlog = "https://blog.be.accountants";
  let fffBlog = "https://blog.forumforthefuture.be";
  let dapBlog = "https://blog.degandpartners.com";
  let blog = "https:blog.tamtam.pro";

  if (env === "local") {
    baBlog = "http://local.blog.be.accountants:3000";
    fffBlog = "http://local.blog.forumforthefuture.be:3000";
    dapBlog = "http://local.blog.degandpartners.com:3000";
    blog = "http://local.blog.tamtam.pro:3000";
  } else if (env === "v2") {
    baBlog = "https://blog.be.accountants";
    fffBlog = "https://blog.forumforthefuture.be";
    dapBlog = "https://blog.degandpartners.com";
    blog = "https:blog.tamtam.pro";
  } else if (env) {
    baBlog = `https://blog.${env}.be.accountants`;
    fffBlog = `https://blog.${env}.forumforthefuture.be`;
    dapBlog = `https://blog.${env}.degandpartners.com`;
    blog = `https://blog.${env}.tamtam.pro`;
  }

  const { url, id, organization, language, isExternal, externalUrl } = article;
  if (isExternal) {
    return externalUrl;
  }

  let fullUrl = `/${language}/article/${url}/${id}`;

  if (hasRelativePath(organization.id, host)) {
    return fullUrl;
  }

  if (organization && [8, 9, 4].includes(organization.id)) {
    if (organization.id === 9) {
      return `${fffBlog}${fullUrl}`;
    } else if (organization.id === 8) {
      return `${baBlog}${fullUrl}`;
    } else if (organization.id === 4) {
      return `${dapBlog}${fullUrl}`;
    }
  }

  return `${blog}${fullUrl}`;
};

const getArticleUrl = (article, env, host) => {
  const { url, id, organization, language, isExternal, externalUrl } = article;

  if (isExternal) {
    return externalUrl;
  }

  let baBlog = "https://blog.be.accountants";
  let fffBlog = "https://blog.forumforthefuture.be";
  let dapBlog = "https://blog.degandpartners.com";

  if (env === "local") {
    baBlog = "http://local.blog.be.accountants:3000";
    fffBlog = "http://local.blog.forumforthefuture.be:3000";
    dapBlog = "http://local.blog.degandpartners.com:3000";
  } else if (env === "v2") {
    baBlog = "https://blog.be.accountants";
    fffBlog = "https://blog.forumforthefuture.be";
    dapBlog = "https://blog.degandpartners.com";
  } else if (env) {
    baBlog = `https://blog.${env}.be.accountants`;
    fffBlog = `https://blog.${env}.forumforthefuture.be`;
    dapBlog = `https://blog.${env}.degandpartners.com`;
  }

  let fullUrl = `/${language}/article/${url}/${id}`;

  if (organization && [8, 9, 4].includes(organization.id)) {
    if (organization.id === 9) {
      return `${fffBlog}${fullUrl}`;
    } else if (organization.id === 8) {
      return `${baBlog}${fullUrl}`;
    } else if (organization.id === 4) {
      return `${dapBlog}${fullUrl}`;
    }
  }

  if (host)
    return env === "local"
      ? `http://${host}/${language}/article/${url}/${id}`
      : `https://${host}/${language}/article/${url}/${id}`;
  else return `/${language}/article/${url}/${id}`;
};

export const getCategoryName = (category, lng) => {
  const nameAttr = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  return category && category[nameAttr] ? category[nameAttr] : "";
};

export const getMainMedia = ({ main_media }) => {
  if (main_media) {
    if (
      main_media.preview &&
      (main_media.preview.fullMediaUrl || main_media.preview.webPath)
    ) {
      return main_media.preview.fullMediaUrl
        ? main_media.preview.fullMediaUrl
        : TTP_API_URL + "/" + main_media.preview.webPath;
    } else {
      if (main_media.fullCroppedWebPath) {
        return main_media.fullCroppedWebPath;
      } else {
        return main_media.fullMediaUrl
          ? main_media.fullMediaUrl
          : `${TTP_API_URL}/${main_media.webPath}`;
      }
    }
  }
  return "/img/article-cover-small.jpg";
};

export const getAlbum = ({ albums }) => {
  let medias = null;
  if (albums && albums.length > 0) {
    medias = albums[0].medias.map((media) => {
      const path =
        media.preview && (media.preview.fullMediaUrl || media.preview.webPath)
          ? media.preview.fullMediaUrl
            ? media.preview.fullMediaUrl
            : `${TTP_API_URL}/${media.preview.webPat}`
          : media.fullMediaUrl
          ? media.fullMediaUrl
          : `${TTP_API_URL}/${media.webPath}`;
      return {
        id: media.id,
        path: path,
      };
    });
  }
  return medias;
};

export const sanitize = (str) => {
  if (!str) {
    return "";
  }
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};

export const getAuthors = ({ author, chains }, lng = "fr") => {
  let authors = [];
  let others = [];
  if (author && author.length > 0) {
    authors = author
      .filter((a) => a.enableAvatar === true)
      .map((a) => {
        return {
          id: a.id,
          name: a.firstName + " " + a.lastName, //a.signature.title
          headline: a.signature.head,
          avatar: a.avatar,
          avatarUrl: a.avatarUrl,
          url: `/${lng}/author/${a.url}/${a.id}`,
        };
      });
  }
  if (chains && chains.length > 0) {
    const nameAttr = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
    others = chains.map((chain) => {
      let mediaChain = null;
      if (chain.mediaChain && chain.mediaChain.length > 0) {
        chain.mediaChain.forEach((media) => {
          if (media.language === lng) {
            mediaChain = media;
          }
        });
      }
      const chainName =
        chain[`name${lng.charAt(0).toUpperCase()}${lng.slice(1)}`];
      let chainUrl = `/${lng}/chain/${chainName ? sanitize(chainName) : "-"}/${
        chain.id
      }`;
      return {
        id: chain.id,
        name: chain[nameAttr],
        headline: chain.headline,
        avatar: mediaChain ? mediaChain.avatar : "",
        avatarUrl: mediaChain ? mediaChain.avatarUrl : "",
        url: chainUrl,
      };
    });
  }

  return [...authors, ...others];
};

export const addLandaSize = (img, width = 0, height = 0) => {
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
};

export const prepareArticle = (article, env = "", host) => {
  const {
    id,
    title,
    status,
    introduction,
    organization,
    category,
    type,
    isPrivate,
    isExternal,
    externalUrl,
    countLikes,
    countDislikes,
    countComments,
    publishedAt,
    social,
    language,
    readTime,
  } = article;

  let socialData = { countLikes, countDislikes, countComments };

  if (social) {
    socialData = {
      ...socialData,
      isLiked: social.isLiked,
      isFavorite: social.isFavorite,
    };
  }

  return {
    id,
    title,
    status,
    introduction,
    communityName:
      organization.abbreviation ||
      (organization.name.length <= 30
        ? organization.name
        : organization.name.substr(0, 30) + "..."),
    category: {
      name: getCategoryName(category, language),
      colorCode: category && category.colorCode ? category.colorCode : "",
    },
    articleType: {
      name: getCategoryName(type, language),
      colorCode: type && type.colorCode ? type.colorCode : "",
    },
    url: getArticleFullUrl(article, env, host),
    shareUrl: getArticleUrl(article, env, host),
    hasRelativePath: hasRelativePath(article, host),
    mainMedia: getMainMedia(article),
    album: getAlbum(article),
    authors: getAuthors(article, language),
    isPrivate,
    isExternal,
    externalUrl,
    countLikes,
    countDislikes,
    countComments,
    publishedAt,
    socialData,
    language,
    readTime,
  };
};

export const isUserHasRights = (user, article) => {
  if (!user) {
    return false;
  }

  let author = null;
  if (article.author) {
    let authors = article.author.filter((a) => a.id === user.id);
    if (authors.length > 0) {
      author = authors[0];
    }
  }

  let userArticleCommunity = null;
  if (article.organization && user.communities) {
    let communities = user.communities.filter(
      (c) => c.id == article.organization.id
    );
    if (communities.length > 0) {
      userArticleCommunity = communities[0];
    }
  }

  let UserBlogRoleInArticleCommunity =
    userArticleCommunity &&
    userArticleCommunity.blogs &&
    userArticleCommunity.blogs[0]
      ? userArticleCommunity.blogs[0]
      : null;

  let isUserArticle = author !== null;
  let isArticlePublished = article.status === "PUBLISHED";

  let isUserCheifEditorInArticleCommunity =
    UserBlogRoleInArticleCommunity !== null &&
    UserBlogRoleInArticleCommunity.role === "CHIEF_EDITOR";
  let isUserMandatedInArticleCommunity =
    UserBlogRoleInArticleCommunity &&
    (UserBlogRoleInArticleCommunity.role === "REDACTOR" ||
      UserBlogRoleInArticleCommunity.role === "AUTHOR") &&
    UserBlogRoleInArticleCommunity.role.mandated == 1;

  let isCurrentUserHasRights =
    isUserArticle ||
    isUserCheifEditorInArticleCommunity ||
    (isArticlePublished && isUserMandatedInArticleCommunity);

  return isCurrentUserHasRights;
};
