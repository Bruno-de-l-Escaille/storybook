import React, { useState } from "react";
import Slider from "react-slick";
import moment from "moment";
import "moment/locale/fr";

import styles from "./Article.module.scss";
import { AuthorAvatar } from "../Avatar/AuthorAvatar";
import { Fetching } from "./Fetching";
import { prepareArticle, addLandaSize } from "../../utils";
import classnames from "classnames";

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
    mainMedia,
    status,
    medias,
    isExternal,
    publishedAt,
    countLikes,
    countDislikes,
    countComments,
    authors,
    socialData,
    hasRelativePath,
  } = data;
  const hasActions = onDelete || onEdit || onPublish ? true : false;
  const mediaUrl = medias && medias.length > 0 ? medias[0].path : mainMedia;

  const renderAvatar = () => {
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
                <AuthorAvatar author={author} />
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
            <h3>{title}</h3>
          </a>
        </Link>
      ) : (
        <a href={url} taget="_blank" className={styles.title}>
          <h3>{title}</h3>
        </a>
      );
    else
      return hasRelativePath ? (
        <a href={url} className={styles.title}>
          <h3>{title}</h3>
        </a>
      ) : (
        <a href={url} taget="_blank" className={styles.title}>
          <h3>{title}</h3>
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
  const renderType2 = () => {
    return (
      <div className={`${styles.articleTemplate2} ${styles[size]}`}>
        {renderAvatar()}
        <div className={styles.content}>
          {publishedAt && (
            <div className={styles.publishedAt}>
              {moment(publishedAt, API_DATE_FORMAT).format(
                "DD MMM YYYY [at] hh:mm"
              )}
            </div>
          )}
          <div
            className={styles.category}
            style={{ background: `${category.colorCode}` }}
          >
            {category.name}
          </div>
          <div
            className={styles.community}
            style={{ borderLeftColor: category.colorCode }}
          >
            {communityName}
          </div>

          {renderTitle()}
          <div className={styles.summary}>{introduction}</div>
          {renderSocialStats()}
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
                  {moment(publishedAt, API_DATE_FORMAT).format(
                    "DD MMM YYYY [at] hh:mm"
                  )}
                </div>
              )}
              <div
                className={styles.category}
                style={{ background: `${category.colorCode}` }}
              >
                {category.name}
              </div>
              <div
                className={styles.community}
                style={{ borderLeftColor: category.colorCode }}
              >
                {communityName}
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
              {moment(publishedAt, API_DATE_FORMAT).format(
                "DD MMM YYYY [at] hh:mm"
              )}
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
              className={styles.contentImg}
              style={{
                backgroundImage: `url(${addLandaSize(mediaUrl, null, 432)})`,
              }}
            ></div>
          )}
          <div className={styles.content}>
            <div
              className={styles.category}
              style={{ background: `${category.colorCode}` }}
            >
              {category.name}
            </div>
            <div
              className={styles.community}
              style={{ borderLeftColor: category.colorCode }}
            >
              {communityName}
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
          className={styles.content}
          style={
            size && size === "large"
              ? { backgroundImage: `url(${addLandaSize(mediaUrl, 1700)})` }
              : { backgroundImage: `url(${addLandaSize(mediaUrl, 520)})` }
          }
        >
          {publishedAt && (
            <div className={styles.publishedAt}>
              {moment(publishedAt, API_DATE_FORMAT).format(
                "DD MMM YYYY [at] hh:mm"
              )}
            </div>
          )}

          <div
            className={styles.category}
            style={{ background: `${category.colorCode}` }}
          >
            {category.name}
          </div>
          <div
            className={styles.community}
            style={{ borderLeftColor: category.colorCode }}
          >
            {communityName}
          </div>

          {renderTitle()}
          {size === "large" && showSummary && (
            <div className={styles.summary}>{introduction}</div>
          )}

          {renderSocialStats()}
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
    default:
      return renderDefault();
  }
};
