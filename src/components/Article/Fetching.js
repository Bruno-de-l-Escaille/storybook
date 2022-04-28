import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./Article.module.scss";

export const Fetching = (props) => {
  const { type, size } = props;

  const renderFetching = () => {
    switch (type) {
      case "type2":
        return renderType2();
      case "type3":
        return renderType3();
      case "type4":
        return renderType4();
      case "type5":
        return renderType5();
      case "type6":
        return renderType6();
      case "type7":
        return renderType7();
      case "type8":
        return renderType8();
      default:
        return renderDefault();
    }
  };
  const renderType8 = () => {
    return (
      <div className={`${styles.articleTemplate8} ${styles[size]}`}>
        <div className={styles.articleContainer}>
          <div className={`${styles.contentImg}`}></div>
          <div className={styles.content}>
            <div style={{ flex: "1", width: "100%" }}>
              <Skeleton width={100} height={25} />
              <div style={{ display: "flex", marginTop: "10px" }}>
                <Skeleton width={80} height={25} />
                &nbsp;
                <Skeleton width={40} height={25} />
              </div>
              <div style={{ width: "100%", marginTop: "20px" }}>
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
              </div>
            </div>
            <div className={styles.userActions} style={{ marginTop: "15px" }}>
              {renderAvatar()}
              <hr />
              <div className={styles.actions}>
                <Skeleton width={30} height={24} />
                &nbsp;
                <Skeleton width={30} height={24} />
                <div style={{ marginLeft: "auto" }}>
                  <Skeleton width={80} height={24} />
                </div>
              </div>
            </div>
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
            style={{
              padding: "10px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: "1", width: "100%" }}>
              <Skeleton width={100} height={25} />
            </div>
            <div className={styles.userActions}>
              <div style={{ display: "flex", marginBottom: "20px" }}>
                <Skeleton width={80} height={25} />
                &nbsp;
                <Skeleton width={40} height={25} />
              </div>
              <div style={{ width: "100%", marginBottom: "40px" }}>
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
              </div>

              {renderAvatar()}
              <hr />
              <div className={styles.actions}>
                <Skeleton width={30} height={24} />
                &nbsp;
                <Skeleton width={30} height={24} />
                <div style={{ marginLeft: "auto" }}>
                  <Skeleton width={80} height={24} />
                </div>
              </div>
            </div>
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
            <div style={{ flex: "1", width: "100%" }}>
              <Skeleton width={100} height={25} />
              <div style={{ display: "flex", marginTop: "100px" }}>
                <Skeleton width={80} height={25} />
                &nbsp;
                <Skeleton width={40} height={25} />
              </div>
              <div style={{ width: "100%", marginTop: "20px" }}>
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
              </div>
              <div style={{ width: "100%", marginTop: "20px" }}>
                <Skeleton width="100%" height={15} />
                <Skeleton width="100%" height={15} />
                <Skeleton width="100%" height={15} />
                <Skeleton width="100%" height={15} />
              </div>
            </div>
            <div className={styles.userActions} style={{ marginTop: "15px" }}>
              {renderAvatar()}
              <hr />
              <div className={styles.actions}>
                <Skeleton width={30} height={24} />
                &nbsp;
                <Skeleton width={30} height={24} />
                <div style={{ marginLeft: "auto" }}>
                  <Skeleton width={80} height={24} />
                </div>
              </div>
            </div>
          </div>
          <div className={`${styles.contentImg}`}>
            <Skeleton width="100%" height="100%" />
          </div>
        </div>
      </div>
    );
  };

  const renderType5 = () => {
    return (
      <div className={`${styles.articleTemplate5} ${styles[size]}`}>
        <div className={styles.articleContainer}>
          <div className={styles.contentImg}>
            <Skeleton width="100%" height="100%" />
          </div>
          <div className={styles.content}>
            <Skeleton width={100} height={25} />
            <div style={{ width: "100%", marginTop: "20px" }}>
              <Skeleton width="100%" height={20} />
              <Skeleton width="100%" height={20} />
              <Skeleton width="100%" height={20} />
            </div>

            {renderAvatar()}

            <div className={styles.userActions}>
              <hr />
              <div className={styles.actions}>
                <Skeleton width={30} height={24} />
                &nbsp;
                <Skeleton width={30} height={24} />
                <div style={{ marginLeft: "auto" }}>
                  <Skeleton width={80} height={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
