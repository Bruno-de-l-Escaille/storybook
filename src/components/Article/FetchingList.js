import React from "react";

import { Fetching } from "./Fetching";

import styles from "./ArticleList.module.scss";

export const FetchingList = ({ dispositions }) => {
  const renderFetching = (disposition) => {
    switch (disposition) {
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
      default:
        return renderDefault();
    }
  };

  const renderDefault = () => {
    return (
      <div className={`${styles.articleList1} grid-x`}>
        <div className="cell small-12">
          <Fetching size="large" />
        </div>
      </div>
    );
  };

  const renderType2 = () => {
    return (
      <div className={`${styles.articleList1} grid-x`}>
        <div className="cell small-12 medium-4">
          <Fetching type="type2" />
        </div>
        <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
          <Fetching type="type3" />
        </div>
      </div>
    );
  };

  const renderType3 = () => {
    return (
      <div className={`${styles.articleList1} grid-x`}>
        <div className="cell small-12 medium-4">
          <Fetching type="type2" />
        </div>
        <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
          <Fetching size="medium" />
        </div>
      </div>
    );
  };

  const renderType4 = () => {
    return (
      <div className={`${styles.articleList1} grid-x grid-margin-x`}>
        <div className="cell small-12 medium-4">
          <Fetching type="type4" />
        </div>
        <div className="cell small-12 medium-4">
          <Fetching type="type4" />
        </div>
        <div className="cell small-12 medium-4">
          <Fetching type="type4" />
        </div>
      </div>
    );
  };

  const renderType5 = () => {
    return (
      <div className={`${styles.articleList1} grid-x`}>
        <div className="cell small-12 medium-4">
          <Fetching size="smallBH" />
        </div>
        <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
          <Fetching size="smallBH" />
        </div>
      </div>
    );
  };

  const renderType6 = () => {
    return (
      <div className={`${styles.articleList1} grid-x grid-margin-x`}>
        <div className="cell small-12 medium-4">
          <Fetching type="type2" />
        </div>
        <div className="cell small-12 medium-4">
          <Fetching type="type2" />
        </div>
        <div className="cell small-12 medium-4">
          <Fetching type="type2" />
        </div>
      </div>
    );
  };

  const renderType7 = () => {
    return (
      <div className={`${styles.articleList1} grid-x`}>
        <div className="cell small-12 medium-4">
          <Fetching size="medium" />
        </div>
        <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
          <Fetching type="type3" />
        </div>
      </div>
    );
  };

  return (
    <>
      {dispositions && dispositions.length > 0
        ? renderFetching(dispositions[0])
        : renderFetching()}
      {dispositions && dispositions.length > 1
        ? renderFetching(dispositions[1])
        : renderFetching()}
    </>
  );
};
