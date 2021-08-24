import React from "react";

import { Article } from "../Article/Article";
import styles from "./ArticleList.module.scss";
import { CAROUSEL_DISPOSITIONS } from "../../config";

import { FetchingList } from "./FetchingList";

export const ArticleList = ({
  dispositions,
  isFetching,
  articles,
  saveFavorite,
  onLike,
  openModal,
  isSavingFavorite,
  isSavingLike,
  isSavingDislike,
  articleId,
  user,
  env,
  Link,
  host,
}) => {
  if (isFetching) {
    return <FetchingList dispositions={dispositions} />;
  }

  const renderDefault = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }

    return (
      <div
        key={key}
        className={`${styles.articleList1} grid-x grid-margin-x grid-margin-x`}
      >
        <div className="cell small-12">
          <Article
            size="large"
            showSummary={true}
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
      </div>
    );
  };

  const renderType1 = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }
    return (
      <div key={key} className={`${styles.articleList1} grid-x grid-margin-x`}>
        <div className="cell small-12 medium-7 large-8">
          <Article
            size="large"
            showSummary={true}
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
        <div className={`${styles.articleTpl2} cell small-12 medium-5 large-4`}>
          {articles.length > 1 && (
            <Article
              size="small"
              showSummary={true}
              article={articles[1]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[1].id)}
              onLike={() => onLike(articles[1].id, 1)}
              onDislike={() => onLike(articles[1].id, 0)}
              openModal={() => openModal(articles[1])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          )}
          {articles.length > 2 && (
            <Article
              size="small"
              showSummary={true}
              article={articles[2]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[2].id)}
              onLike={() => onLike(articles[2].id, 1)}
              onDislike={() => onLike(articles[2].id, 0)}
              openModal={() => openModal(articles[2])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          )}
        </div>
      </div>
    );
  };

  const renderType2 = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }

    return (
      <div className={`${styles.articleList1} grid-x`} key={key}>
        <div className="cell small-12 medium-4">
          <Article
            type="type2"
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
        {articles.length > 1 && (
          <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
            <Article
              type="type3"
              article={articles[1]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[1].id)}
              onLike={() => onLike(articles[1].id, 1)}
              onDislike={() => onLike(articles[1].id, 0)}
              openModal={() => openModal(articles[1])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
      </div>
    );
  };

  const renderType3 = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }

    return (
      <div className={`${styles.articleList1} grid-x`} key={key}>
        <div className="cell small-12 medium-4">
          <Article
            type="type2"
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
        {articles.length > 1 && (
          <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
            <Article
              size="medium"
              article={articles[1]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[1].id)}
              onLike={() => onLike(articles[1].id, 1)}
              onDislike={() => onLike(articles[1].id, 0)}
              openModal={() => openModal(articles[1])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
      </div>
    );
  };

  const renderType4 = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }

    return (
      <div className={`${styles.articleList1} grid-x grid-margin-x`} key={key}>
        <div className="cell small-12 medium-4">
          <Article
            type="type4"
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
        {articles.length > 1 && (
          <div className="cell small-12 medium-4">
            <Article
              type="type4"
              article={articles[1]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[1].id)}
              onLike={() => onLike(articles[1].id, 1)}
              onDislike={() => onLike(articles[1].id, 0)}
              openModal={() => openModal(articles[1])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
        {articles.length > 2 && (
          <div className="cell small-12 medium-4">
            <Article
              type="type4"
              article={articles[2]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[2].id)}
              onLike={() => onLike(articles[2].id, 1)}
              onDislike={() => onLike(articles[2].id, 0)}
              openModal={() => openModal(articles[2])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
      </div>
    );
  };

  const renderType5 = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }

    return (
      <div className={`${styles.articleList1} grid-x`} key={key}>
        <div className="cell small-12 medium-4">
          <Article
            size="smallBH"
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
        {articles.length > 1 && (
          <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
            <Article
              size="smallBH"
              article={articles[1]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[1].id)}
              onLike={() => onLike(articles[1].id, 1)}
              onDislike={() => onLike(articles[1].id, 0)}
              openModal={() => openModal(articles[1])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
      </div>
    );
  };

  const renderType6 = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }

    return (
      <div className={`${styles.articleList1} grid-x grid-margin-x`} key={key}>
        <div className="cell small-12 medium-4">
          <Article
            type="type2"
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
        {articles.length > 1 && (
          <div className="cell small-12 medium-4">
            <Article
              type="type2"
              article={articles[1]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[1].id)}
              onLike={() => onLike(articles[1].id, 1)}
              onDislike={() => onLike(articles[1].id, 0)}
              openModal={() => openModal(articles[1])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
        {articles.length > 2 && (
          <div className="cell small-12 medium-4">
            <Article
              type="type2"
              article={articles[2]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[2].id)}
              onLike={() => onLike(articles[2].id, 1)}
              onDislike={() => onLike(articles[2].id, 0)}
              openModal={() => openModal(articles[2])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
      </div>
    );
  };

  const renderType7 = ({ key, articles }) => {
    if (!articles || articles.length === 0) {
      return null;
    }

    return (
      <div className={`${styles.articleList1} grid-x`} key={key}>
        <div className="cell small-12 medium-4">
          <Article
            size="medium"
            article={articles[0]}
            isFetching={isFetching}
            user={user}
            env={env}
            saveFavorite={() => saveFavorite(articles[0].id)}
            onLike={() => onLike(articles[0].id, 1)}
            onDislike={() => onLike(articles[0].id, 0)}
            openModal={() => openModal(articles[0])}
            isSavingFavorite={isSavingFavorite}
            isSavingLike={isSavingLike}
            isSavingDislike={isSavingDislike}
            articleId={articleId}
            Link={Link}
            host={host}
          />
        </div>
        {articles.length > 1 && (
          <div className={`${styles.articleTpl1} cell small-12 medium-8`}>
            <Article
              type="type3"
              article={articles[1]}
              isFetching={isFetching}
              user={user}
              env={env}
              saveFavorite={() => saveFavorite(articles[1].id)}
              onLike={() => onLike(articles[1].id, 1)}
              onDislike={() => onLike(articles[1].id, 0)}
              openModal={() => openModal(articles[1])}
              isSavingFavorite={isSavingFavorite}
              isSavingLike={isSavingLike}
              isSavingDislike={isSavingDislike}
              articleId={articleId}
              Link={Link}
              host={host}
            />
          </div>
        )}
      </div>
    );
  };

  const renderList = (bloc) => {
    switch (bloc.disposition) {
      case "type1":
        return renderType1(bloc);
        break;
      case "type2":
        return renderType2(bloc);
        break;
      case "type3":
        return renderType3(bloc);
        break;
      case "type4":
        return renderType4(bloc);
        break;
      case "type5":
        return renderType5(bloc);
        break;
      case "type6":
        return renderType6(bloc);
        break;
      case "type7":
        return renderType7(bloc);
        break;
      default:
        return renderDefault(bloc);
    }
  };

  if (!dispositions || dispositions.length === 0) {
    dispositions = ["default"];
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  const getSliceLimit = (count, disposition) => {
    let fin = count + CAROUSEL_DISPOSITIONS[disposition];
    if (fin < articles.length) return fin;
    else return articles.length;
  };

  let blocs = [];
  let count = 0;
  while (count < articles.length) {
    dispositions.forEach((disposition, index) => {
      blocs.push({
        key: "bloc-" + Math.random(),
        articles: articles.slice(count, getSliceLimit(count, disposition)),
        disposition: disposition,
      });
      count += CAROUSEL_DISPOSITIONS[disposition];
    });
  }
  return (
    <>
      {blocs.map((bloc) => {
        return renderList(bloc);
      })}
    </>
  );
};
