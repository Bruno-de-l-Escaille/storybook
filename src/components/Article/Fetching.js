import React from "react";

import Skeleton from "react-loading-skeleton";
import styles from "./Article.module.scss";

export const Fetching = (props) => {
  const { type, size } = props;

  const renderFetching = () => {
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

  const renderType4 = () => {
    return (
      <div className={`${styles.articleTemplate4} ${styles[size]}`}>
        {renderAvatar()}
        <div className={styles.articleContainer}>
          <div className={styles.publishedAt}>
            <Skeleton width={100} height={15} />
          </div>
          <div className={styles.contentImg}>
            <Skeleton width="100%" height="100%" />
          </div>
          {renderContent()}
        </div>
      </div>
    );
  };

  const renderType3 = () => {
    return (
      <div className={`${styles.articleTemplate3} ${size ? styles[size] : ""}`}>
        {renderAvatar()}
        <div className={styles.row}>
          <div className={`${styles.col6} ${styles.contentImg}`}>
            <Skeleton width="100%" height="100%" />
          </div>
          <div className={`${styles.col6} ${styles.articleTemplate2}`}>
            {renderContent(true)}
          </div>
        </div>
      </div>
    );
  };

  const renderAvatar = () => {
    return (
      <div className={styles.authorsContainer}>
        <div className={styles["fetching_avatar"]}>
          <Skeleton circle={true} height={34} width={34} />
          <Skeleton width={100} height={20} />
        </div>
      </div>
    );
  };

  const renderContent = (hasDate) => {
    return (
      <div className={styles.content}>
        {hasDate && (
          <div className={styles.publishedAt}>
            <Skeleton width={100} height={15} />
          </div>
        )}
        <div className={styles["fetching_category"]}>
          <Skeleton width={70} height={25} />
        </div>
        <div className={styles.community}>
          <Skeleton width={80} height={15} />
        </div>

        <div className={styles.title}>
          <Skeleton width="100%" height={20} />
        </div>
        <div className={styles.summary}>
          <Skeleton width="100%" height={15} />
          <Skeleton width="100%" height={15} />
          <Skeleton width="100%" height={15} />
          <Skeleton width="100%" height={15} />
        </div>
        <div className={styles.actionsContainer}>
          <Skeleton width={40} height={24} />
          &nbsp;
          <Skeleton width={40} height={24} />
          &nbsp;
          <Skeleton width={40} height={24} />
        </div>
      </div>
    );
  };
  const renderType2 = () => {
    return (
      <div
        className={
          size
            ? `${styles.articleTemplate2} ${styles[size]}`
            : styles.articleTemplate2
        }
      >
        {renderAvatar()}
        {renderContent(true)}
      </div>
    );
  };

  const renderDefault = () => {
    return (
      <div
        className={size ? `${styles.article} ${styles[size]}` : styles.article}
      >
        <div className={styles.authorsContainer}>
          <div className={styles["fetching_avatar"]}>
            <Skeleton circle={true} height={34} width={34} />
            <Skeleton width={100} height={20} />
          </div>
        </div>
        <div className={styles["fetching_content"]}>
          <div className={styles.publishedAt}>
            <Skeleton width={100} height={15} />
          </div>
          <div className={styles["fetching_img"]}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
      </div>
    );
  };

  return renderFetching();
};
