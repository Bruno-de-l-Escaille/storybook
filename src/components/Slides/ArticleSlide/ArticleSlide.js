import React, { useState } from "react";
import Slide from "../Common/Slide/Slide";
import { convertDateFromUTC, prepareArticle } from "../../../utils";
import { Speakers } from "../Common/Speakers/Speakers";
import styles from "./ArticleSlide.module.scss";
import { I18N } from "../../../i18n";
import cn from "classnames";
import IconComment from "../../Icons/IconComment";
import IconLike from "../../Icons/IconLike";
import { Fetching } from "../Common/Slide/Fetching";

const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const ArticleSlide = ({ article, language, env, host, isFetching }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isFetching) {
    return <Fetching />;
  }

  const { title, author, organization } = article;

  const data = prepareArticle(article, env, host);
  const {
    mainMedia,
    medias,
    category,
    publishedAt,
    readTime,
    countLikes,
    countComments,
    socialData,
    shareUrl,
    url,
  } = data;

  const mediaUrl = medias && medias.length > 0 ? medias[0].path : mainMedia;

  return (
    <Slide bannerSrc={mediaUrl} className={styles.articleSlide}>
      <Slide.Header title={title} clientImg={organization.avatarUrl} link={url}>
        <span className={styles.category}>{category.name}</span>
      </Slide.Header>
      <Slide.Body>
        <Speakers speakers={author} />
      </Slide.Body>
      <Slide.Footer className={styles.footer}>
        <div className={styles.infos}>
          <span className={styles.publishedAt}>
            {I18N[language].publishedOn}
            {convertDateFromUTC(
              publishedAt,
              language,
              API_DATE_FORMAT,
              " DD MMM YYYY, " + I18N[language].atText + " HH:mm"
            )}
          </span>
          <span className={styles.dot} />
          <span className={styles.readTime}>
            {I18N[language].reading} {readTime}min
          </span>
        </div>
        <hr />
        <div className={styles.actions}>
          <div className={cn(styles.reactActions)}>
            <span
              className={cn(
                styles.likes,
                socialData.isLiked === 1 && styles.active
              )}
            >
              <IconLike />
              {countLikes > 0 && countLikes}
            </span>
            <span className={styles.comments}>
              <IconComment />
              {countComments > 0 && countComments}
            </span>
          </div>
          <div className={styles.share}>
            <span onClick={() => setIsOpen(!isOpen)}>
              {I18N[language].share}
            </span>
            <div className={cn(styles.sharePopup, isOpen ? "show" : "hide")}>
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
      </Slide.Footer>
    </Slide>
  );
};
