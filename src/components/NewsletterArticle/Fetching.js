import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./NewsletterArticle.module.scss";

export const Fetching = () => {
  return (
    <div className={styles.article_container}>
      <div className={styles.article_loading}>
        <div className={styles.image_loader}>
          <Skeleton width={135} height={104} style={{ borderRadius: 5 }} />
        </div>
        <div className={styles.content_loader}>
          <div className={styles.author_loader}>
            <Skeleton width={80} height={18} style={{ borderRadius: 4 }} />
          </div>
          <div className={styles.title_loader}>
            <Skeleton width="60%" height={20} style={{ borderRadius: 4 }} />
          </div>
          <div className={styles.summary_loader}>
            <Skeleton width="90%" height={14} style={{ borderRadius: 4 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fetching;