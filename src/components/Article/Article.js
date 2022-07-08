import React, { useState } from "react";
import Slider from "react-slick";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/nl";

import styles from "./Article.module.scss";
import { AuthorAvatar } from "../Avatar/AuthorAvatar";
import { Fetching } from "./Fetching";
import { prepareArticle, isUserHasRights, addLandaSize } from "../../utils";
import classnames from "classnames";
import { I18N } from "../../i18n";

const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const Article = ({
  article,
  type,
  env,
  size,
  isFetching,
  showSummary,
  showStatus,
  onPublish,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  saveFavorite,
  openModal,
  articleId,
  isSavingFavorite,
  isSavingLike,
  isSavingDislike,
  user,
  Link,
  host,
  targetBlank,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isFetching) return <Fetching type={type} size={size} />;
  const data = prepareArticle(article, env, host);

  const {
    id,
    title,
    url,
    shareUrl,
    introduction,
    communityName,
    category,
    articleType,
    mainMedia,
    status,
    medias,
    isPrivate,
    isExternal,
    publishedAt,
    countLikes,
    countDislikes,
    countComments,
    authors,
    socialData,
    hasRelativePath,
    language,
    readTime,
  } = data;
  const hasRights = isUserHasRights(user, article);
  const hasActions =
    hasRights && (onDelete || onEdit || onPublish) ? true : false;
  const mediaUrl = medias && medias.length > 0 ? medias[0].path : mainMedia;

  const renderAvatar = (white) => {
    if (isExternal) {
      return (
        <div className={styles.isExternal}>
          <i className="icon-sb-earth" />
        </div>
      );
    } else {
      return (
        <div className={styles.authorsContainer}>
          <ul>
            {authors.map((author) => (
              <li key={`author-${id}-${author.id}`}>
                <AuthorAvatar author={author} white={white} />
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  const articleLink = () => {
    if (Link)
      return hasRelativePath ? (
        <Link href={url}>
          <a className={styles.title}>
            <h3>
              {title} {isPrivate && <i className="icon-sb-premium"></i>}
            </h3>
          </a>
        </Link>
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className={styles.title}>
          <h3>
            {title} {isPrivate && <i className="icon-sb-premium"></i>}
          </h3>
        </a>
      );
    else
      return hasRelativePath ? (
        targetBlank ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={styles.title}
          >
            <h3>
              {title} {isPrivate && <i className="icon-sb-premium"></i>}
            </h3>
          </a>
        ) : (
          <a href={url} className={styles.title}>
            <h3>
              {title} {isPrivate && <i className="icon-sb-premium"></i>}
            </h3>
          </a>
        )
      ) : (
        <a href={url} target="_blank" rel="noreferrer" className={styles.title}>
          <h3>
            {title} {isPrivate && <i className="icon-sb-premium"></i>}
          </h3>
        </a>
      );
  };

  const renderTitle = () => {
    if (isExternal)
      return (
        <a href={url} target="_blank" rel="noreferrer" className={styles.title}>
          <h3>{title}</h3>
        </a>
      );
    else return articleLink();
  };

  const renderSocialStats = () => {
    if (!user) return null;
    return (
      <div className={styles.actionsContainer}>
        <div>
          <div className={styles.stat} onClick={() => openModal()}>
            <i className="icon-sb-thumb-up" />
            <span className={styles.actionCount}>{countLikes}</span>
          </div>
          <div className={styles.stat} onClick={() => openModal()}>
            <i className="icon-sb-thumb-down" />
            <span className={styles.actionCount}>{countDislikes}</span>
          </div>
          <div className={styles.stat} onClick={() => openModal()}>
            <i className="icon-sb-comment" />
            <span className={styles.actionCount}>{countComments}</span>
          </div>
        </div>
        <div className={styles.actions}>
          <div
            className={classnames(
              styles.action,
              socialData.isLiked === 1 ? styles.activeAction : ""
            )}
            onClick={() => onLike()}
          >
            <i
              className={classnames(
                "icon-sb-thumb-up",
                articleId === article.id && isSavingLike
                  ? "animate__bounceIn"
                  : ""
              )}
            />
          </div>
          <div
            className={classnames(
              styles.action,
              socialData.isLiked === 0 ? styles.activeAction : ""
            )}
            onClick={() => onDislike()}
          >
            <i
              className={classnames(
                "icon-sb-thumb-down",
                articleId === article.id && isSavingDislike
                  ? "animate__bounceIn"
                  : ""
              )}
            />
          </div>
          <div className={styles.action} onClick={() => openModal()}>
            <i className="icon-sb-comment" />
          </div>
          <div className={styles.action} onClick={() => setIsOpen(!isOpen)}>
            <i className="icon-sb-share" />
            <div
              className={classnames(
                styles.sharePopup,
                isOpen ? "show" : "hide"
              )}
            >
              <a
                className={styles.action}
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-sb-facebook" />
              </a>
              <a
                className={styles.action}
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-sb-linkedin" />
              </a>

              <a
                className={styles.action}
                href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-sb-twitter" />
              </a>
            </div>
          </div>
          {saveFavorite && (
            <div
              className={classnames(
                styles.action,
                socialData.isFavorite === 1 ? styles.activeAction : ""
              )}
              onClick={() => saveFavorite()}
            >
              <i
                className={classnames(
                  "icon-sb-star-o",
                  articleId === article.id && isSavingFavorite
                    ? "animate__bounceIn"
                    : ""
                )}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPublishedAtRenderTime = () => {
    if (!publishedAt) return null;
    return (
      <div className={styles.publishedAtReadTime}>
        Publié le
        {moment(publishedAt, API_DATE_FORMAT)
          .locale(language)
          .format("DD MMM YYYY " + I18N[language].atText + " HH:mm")}
        {readTime && (
          <div className={styles.readTime}>
            <div className={styles.dot}></div>
            <span>
              {I18N[language].reading} {readTime}min
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderUserSocialActions = () => {
    if (!user) return null;
    return (
      <div className={styles.userActions}>
        <hr />
        <div className={styles.actions}>
          <div className={styles.likes} onClick={() => onLike()}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 4.5C14.9 4.5 13.05 5.55 12 7.2C10.95 5.55 9.1 4.5 7 4.5C3.7 4.5 1 7.2 1 10.5C1 16.45 12 22.5 12 22.5C12 22.5 23 16.5 23 10.5C23 7.2 20.3 4.5 17 4.5Z"
                fill={socialData.isLiked === 1 ? "#C70039" : "#D8DDE2"}
              />
            </svg>
            {countLikes}
          </div>
          <div className={styles.comments} onClick={() => openModal()}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C5.92422 2 1 6.00039 1 10.9375C1 13.0688 1.91953 15.0195 3.44922 16.5535C2.91211 18.7191 1.11602 20.6484 1.09453 20.6699C1 20.7687 0.974219 20.9148 1.03008 21.0438C1.08594 21.1727 1.20625 21.25 1.34375 21.25C4.19258 21.25 6.32813 19.8836 7.38516 19.0414C8.79023 19.5699 10.35 19.875 12 19.875C18.0758 19.875 23 15.8746 23 10.9375C23 6.00039 18.0758 2 12 2Z"
                fill="#D8DDE2"
              />
            </svg>
            {countComments}
          </div>
          <div className={styles.share}>
            <span onClick={() => setIsOpen(!isOpen)}>Partager</span>
            <div
              className={classnames(
                styles.sharePopup,
                isOpen ? "show" : "hide"
              )}
            >
              <a
                className={styles.action}
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-sb-facebook" />
              </a>
              <a
                className={styles.action}
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-sb-linkedin" />
              </a>

              <a
                className={styles.action}
                href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="icon-sb-twitter" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRelatedArticles = (relatedArticles) => {
    return (
      <div className={styles.version}>
        <span>{I18N[language]["see_version"]}:</span>
        {Object.entries(relatedArticles).map((related) => {
          if (Link)
            return (
              <span className={styles.vIterm}>
                <Link
                  href={`/${related[0]}/article/${related[1].url}/${related[1].id}`}
                >
                  <a>
                    <img
                      src={`/img/flags/${related[0]}.png`}
                      width="24"
                      height="24"
                      alt=""
                    />
                  </a>
                </Link>
              </span>
            );
          else
            return (
              <span className={styles.vIterm}>
                <a
                  href={`/${related[0]}/article/${related[1].url}/${related[1].id}`}
                >
                  <img
                    src={`/img/flags/${related[0]}.png`}
                    width="24"
                    height="24"
                    alt=""
                  />
                </a>
              </span>
            );
        })}
      </div>
    );
  };

  const renderType2 = () => {
    return (
      <div className={`${styles.articleTemplate2} ${styles[size]}`}>
        {renderAvatar()}
        <div
          className={`${styles.content} ${hasActions ? styles.hasActions : ""}`}
        >
          {publishedAt && (
            <div className={styles.publishedAt}>
              {moment(publishedAt, API_DATE_FORMAT)
                .locale(language)
                .format("DD MMM YYYY " + I18N[language].atText + " HH:mm")}
            </div>
          )}
          <div
            className={styles.category}
            style={{ background: `${category.colorCode}` }}
          >
            {category.name}
          </div>
          <div className={styles.meta}>
            {articleType && articleType.name ? (
              <span style={{ backgroundColor: articleType.colorCode }}>
                {articleType.name}
              </span>
            ) : null}
            <div
              className={styles.community}
              style={{ borderLeftColor: category.colorCode }}
            >
              {communityName}
            </div>
          </div>

          {renderTitle()}
          <div className={styles.summary}>{introduction}</div>
          {renderSocialStats()}

          {hasActions && onEdit && (
            <div className={styles.buttons}>
              {onEdit && (
                <button>
                  <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderType3 = () => {
    return (
      <div className={`${styles.articleTemplate3} ${size ? styles[size] : ""}`}>
        {renderAvatar()}
        <div className={styles.row}>
          <div
            className={
              hasActions && type === "type3"
                ? `${styles.col6} ${styles.contentImg} ${styles.hasActions}`
                : `${styles.col6} ${styles.contentImg}`
            }
            style={{ backgroundImage: `url(${addLandaSize(mediaUrl, 570)})` }}
          >
            {showStatus && (
              <div
                className={`${styles.status} ${styles[status.toLowerCase()]}`}
              >
                {status}
              </div>
            )}
            {hasActions && type === "type3" && (
              <div className={styles.buttons}>
                {status !== "PUBLISHED" && onPublish && (
                  <div>
                    <button onClick={() => onPublish()}>
                      <i className="icon-sb-paper-airplane"></i>
                    </button>
                  </div>
                )}
                {onEdit && (
                  <button>
                    <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                  </button>
                )}
                {onDelete && (
                  <button
                    className={styles["btn-delete"]}
                    onClick={() => onDelete()}
                  >
                    <i className="icon-sb-trash"></i>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className={`${styles.col6} ${styles.articleTemplate2}`}>
            <div className={styles.content}>
              {publishedAt && (
                <div className={styles.publishedAt}>
                  {moment(publishedAt, API_DATE_FORMAT)
                    .locale(language)
                    .format("DD MMM YYYY " + I18N[language].atText + " HH:mm")}
                </div>
              )}
              <div
                className={styles.category}
                style={{ background: `${category.colorCode}` }}
              >
                {category.name}
              </div>
              <div className={styles.meta}>
                {articleType && articleType.name ? (
                  <span style={{ backgroundColor: articleType.colorCode }}>
                    {articleType.name}
                  </span>
                ) : null}
                <div
                  className={styles.community}
                  style={{ borderLeftColor: category.colorCode }}
                >
                  {communityName}
                </div>
              </div>
              {renderTitle()}
              <div className={styles.summary}>{introduction}</div>
              {renderSocialStats()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderType4 = () => {
    const settings = {
      dots: true,
      dotsClass: "slick-dots ",
      infinite: true,
      arrows: false,
      speed: 500,
      height: "100%",
      autoplay: false,
    };

    return (
      <div className={`${styles.articleTemplate4} ${styles[size]}`}>
        {renderAvatar()}
        <div className={styles.articleContainer}>
          {publishedAt && (
            <div className={styles.publishedAt}>
              {moment(publishedAt, API_DATE_FORMAT)
                .locale(language)
                .format("DD MMM YYYY " + I18N[language].atText + " HH:mm")}
            </div>
          )}

          {medias && medias.length > 0 ? (
            <div className={styles.contentImg}>
              <Slider {...settings}>
                {medias.map((media) => {
                  return (
                    <div key={`slide-${media.id}`}>
                      <div
                        style={{
                          background: `url(${addLandaSize(
                            media.path,
                            null,
                            432
                          )}) no-repeat center center`,
                          backgroundSize: "cover",
                          width: "100%",
                          height: "216px",
                          backgroundColor: "red",
                        }}
                      ></div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          ) : (
            <div
              className={`${styles.contentImg} ${
                hasActions ? styles.hasActions : ""
              }`}
              style={{
                backgroundImage: `url(${addLandaSize(mediaUrl, null, 432)})`,
              }}
            >
              {hasActions && onEdit && (
                <div className={styles.buttons}>
                  {onEdit && (
                    <button>
                      <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          <div className={styles.content}>
            <div
              className={styles.category}
              style={{ background: `${category.colorCode}` }}
            >
              {category.name}
            </div>
            <div className={styles.meta}>
              {articleType && articleType.name ? (
                <span style={{ backgroundColor: articleType.colorCode }}>
                  {articleType.name}
                </span>
              ) : null}
              <div
                className={styles.community}
                style={{ borderLeftColor: category.colorCode }}
              >
                {communityName}
              </div>
            </div>

            {renderTitle()}
            <div className={styles.summary}>{introduction}</div>
            {renderSocialStats()}
          </div>
        </div>
      </div>
    );
  };

  const renderDefault = () => {
    return (
      <div
        className={classnames(
          styles.article,
          styles.default,
          size ? styles[size] : ""
        )}
      >
        {renderAvatar()}
        <div
          className={`${styles.content} ${hasActions ? styles.hasActions : ""}`}
          style={
            size && size === "large"
              ? { backgroundImage: `url(${addLandaSize(mediaUrl, 1700)})` }
              : { backgroundImage: `url(${addLandaSize(mediaUrl, 520)})` }
          }
        >
          {publishedAt && (
            <div className={styles.publishedAt}>
              {moment(publishedAt, API_DATE_FORMAT)
                .locale(language)
                .format("DD MMM YYYY " + I18N[language].atText + " HH:mm")}
            </div>
          )}

          <div
            className={styles.category}
            style={{ background: `${category.colorCode}` }}
          >
            {category.name}
          </div>
          <div className={styles.meta}>
            {articleType && articleType.name ? (
              <span style={{ backgroundColor: articleType.colorCode }}>
                {articleType.name}
              </span>
            ) : null}
            <div
              className={styles.community}
              style={{ borderLeftColor: category.colorCode }}
            >
              {communityName}
            </div>
          </div>

          {renderTitle()}
          {size === "large" && showSummary && (
            <div className={styles.summary}>{introduction}</div>
          )}

          {renderSocialStats()}

          {hasActions && onEdit && (
            <div className={styles.buttons}>
              {onEdit && (
                <button>
                  <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderType5 = () => {
    // const settings = {
    //   dots: true,
    //   dotsClass: "slick-dots ",
    //   infinite: true,
    //   arrows: false,
    //   speed: 500,
    //   height: "100%",
    //   autoplay: false,
    // };

    return (
      <div className={`${styles.articleTemplate5} ${styles[size]}`}>
        <div className={styles.articleContainer}>
          <div
            className={classnames(
              styles.contentImg,
              hasActions ? styles.hasActions : ""
            )}
            style={{
              backgroundImage: `url(${addLandaSize(mediaUrl, null, 432)})`,
            }}
          >
            {hasActions && (
              <div className={styles.buttons}>
                {status !== "PUBLISHED" && onPublish && (
                  <div>
                    <button onClick={() => onPublish()}>
                      <i className="icon-sb-paper-airplane"></i>
                    </button>
                  </div>
                )}
                {onEdit && (
                  <button>
                    <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                  </button>
                )}
                {onDelete && (
                  <button
                    className={styles["btn-delete"]}
                    onClick={() => onDelete()}
                  >
                    <i className="icon-sb-trash"></i>
                  </button>
                )}
              </div>
            )}
            <div className={styles.categoryChannel}>
              <div
                className={styles.category}
                style={{ background: `${category.colorCode}` }}
              >
                {category.name}
              </div>
              {article.avatars && article.avatars.length > 0 && (
                <div
                  className={styles.channel}
                  style={{
                    backgroundImage: `url(${article.avatars[0].avatarUrl})`,
                  }}
                ></div>
              )}
            </div>
            {article.relatedArticles &&
              renderRelatedArticles(article.relatedArticles)}
          </div>

          <div className={styles.content}>
            <div className={styles.meta}>
              {articleType && articleType.name ? (
                <span>{articleType.name}</span>
              ) : null}
              <div
                className={styles.community}
                style={{ borderLeftColor: category.colorCode }}
              >
                {communityName}
              </div>
            </div>
            {renderTitle()}
            {renderAvatar()}
            {renderPublishedAtRenderTime()}
            {renderUserSocialActions()}
          </div>
        </div>
      </div>
    );
  };

  const renderType6 = () => {
    return (
      <div className={`${styles.articleTemplate6} ${styles[size]}`}>
        <div className={styles.articleContainer}>
          <div className={styles.content}>
            <div className={styles.categoryChannel}>
              <div
                className={styles.category}
                style={{ background: `${category.colorCode}` }}
              >
                {category.name}
              </div>
              {article.avatars && article.avatars.length > 0 && (
                <div
                  className={styles.channel}
                  style={{
                    backgroundImage: `url(${article.avatars[0].avatarUrl})`,
                  }}
                ></div>
              )}
            </div>
            {article.relatedArticles &&
              renderRelatedArticles(article.relatedArticles)}
            <div className={styles.meta}>
              {articleType && articleType.name ? (
                <span>{articleType.name}</span>
              ) : null}
              <div
                className={styles.community}
                style={{ borderLeftColor: category.colorCode }}
              >
                {communityName}
              </div>
            </div>
            {renderTitle()}
            <div className={styles.summary}>{introduction}</div>
            {renderAvatar()}
            {renderPublishedAtRenderTime()}
            {renderUserSocialActions()}
          </div>
          <div
            className={classnames(
              styles.contentImg,
              hasActions ? styles.hasActions : ""
            )}
            style={{
              backgroundImage: `url(${addLandaSize(mediaUrl, null, 432)})`,
            }}
          >
            {hasActions && (
              <div className={styles.buttons}>
                {status !== "PUBLISHED" && onPublish && (
                  <div>
                    <button onClick={() => onPublish()}>
                      <i className="icon-sb-paper-airplane"></i>
                    </button>
                  </div>
                )}
                {onEdit && (
                  <button>
                    <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                  </button>
                )}
                {onDelete && (
                  <button
                    className={styles["btn-delete"]}
                    onClick={() => onDelete()}
                  >
                    <i className="icon-sb-trash"></i>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderType7 = () => {
    return (
      <div className={`${styles.articleTemplate7} ${styles[size]}`}>
        <div className={styles.articleContainer}>
          <div
            className={classnames(
              styles.contentImg,
              hasActions ? styles.hasActions : ""
            )}
            style={{
              backgroundImage: `url(${addLandaSize(mediaUrl, null, 432)})`,
            }}
          >
            {hasActions && (
              <div className={styles.buttons}>
                {status !== "PUBLISHED" && onPublish && (
                  <div>
                    <button onClick={() => onPublish()}>
                      <i className="icon-sb-paper-airplane"></i>
                    </button>
                  </div>
                )}
                {onEdit && (
                  <button>
                    <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                  </button>
                )}
                {onDelete && (
                  <button
                    className={styles["btn-delete"]}
                    onClick={() => onDelete()}
                  >
                    <i className="icon-sb-trash"></i>
                  </button>
                )}
              </div>
            )}
            <div className={styles.categoryChannel}>
              <div
                className={styles.category}
                style={{ background: `${category.colorCode}` }}
              >
                {category.name}
              </div>
              {article.avatars && article.avatars.length > 0 && (
                <div
                  className={styles.channel}
                  style={{
                    backgroundImage: `url(${article.avatars[0].avatarUrl})`,
                  }}
                ></div>
              )}
            </div>
            {article.relatedArticles &&
              renderRelatedArticles(article.relatedArticles)}
            <div className={styles.meta}>
              {articleType && articleType.name ? (
                <span>{articleType.name}</span>
              ) : null}
              <div
                className={styles.community}
                style={{ borderLeftColor: category.colorCode }}
              >
                {communityName}
              </div>
            </div>
            {renderTitle()}
            {renderAvatar(true)}
            {renderPublishedAtRenderTime()}
            {renderUserSocialActions()}
          </div>
        </div>
      </div>
    );
  };

  const renderType8 = () => {
    return (
      <div className={`${styles.articleTemplate8} ${styles[size]}`}>
        <div className={styles.articleContainer}>
          <div
            className={classnames(
              styles.contentImg,
              hasActions ? styles.hasActions : ""
            )}
            style={{
              backgroundImage: `url(${addLandaSize(mediaUrl, null, 432)})`,
            }}
          >
            {hasActions && (
              <div className={styles.buttons}>
                {status !== "PUBLISHED" && onPublish && (
                  <div>
                    <button onClick={() => onPublish()}>
                      <i className="icon-sb-paper-airplane"></i>
                    </button>
                  </div>
                )}
                {onEdit && (
                  <button>
                    <i className="icon-sb-edit" onClick={() => onEdit()}></i>
                  </button>
                )}
                {onDelete && (
                  <button
                    className={styles["btn-delete"]}
                    onClick={() => onDelete()}
                  >
                    <i className="icon-sb-trash"></i>
                  </button>
                )}
              </div>
            )}
          </div>
          <div className={styles.content}>
            <div className={styles.categoryChannel}>
              <div
                className={styles.category}
                style={{ background: `${category.colorCode}` }}
              >
                {category.name}
              </div>
              {article.avatars && article.avatars.length > 0 && (
                <div
                  className={styles.channel}
                  style={{
                    backgroundImage: `url(${article.avatars[0].avatarUrl})`,
                  }}
                ></div>
              )}
            </div>
            <div className={styles.meta}>
              {articleType && articleType.name ? (
                <span>{articleType.name}</span>
              ) : null}
              <div
                className={styles.community}
                style={{ borderLeftColor: category.colorCode }}
              >
                {communityName}
              </div>
            </div>
            {renderTitle()}
            {article.relatedArticles &&
              renderRelatedArticles(article.relatedArticles)}
            {renderAvatar()}
            {renderPublishedAtRenderTime()}
            {renderUserSocialActions()}
          </div>
        </div>
      </div>
    );
  };

  switch (type) {
    case "type2":
      return renderType2();
      break;
    case "type3":
      return renderType3();
      break;
    case "type4":
      return renderType4();
      break;
    case "type5":
      return renderType5();
      break;
    case "type6":
      return renderType6();
      break;
    case "type7":
      return renderType7();
      break;
    case "type8":
      return renderType8();
      break;
    default:
      return renderDefault();
  }
};
