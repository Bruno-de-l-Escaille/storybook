import React, { useState } from "react";
import moment from "moment-timezone";
import classNames from "classnames";
import { toast } from "react-toastify";
import { I18N } from "../../i18n";
import { Fetching } from "./Fetching";
import styles from "./NewsletterArticle.module.scss";

const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";


export const NewsletterArticle = ({
  article,
  language = "en",
  articles = [],
  setArticles,
  index = 0,
  mIndex,
  isPassed,
  inAccordion,
  periodConfig,
  handleRemoveArticle,
  nbArticles = 0,
  endDate,
  startDate,
  listeners,
  attributes,
  style,
  month,
  year,
  period,
  isPersonnalizedOrDeg,
  nbOfArticles,
  nbOfFffArticles,
  setIsEdit,
  periodNumber,
  isLocked,
  checkedPlans,
  articlesByPlanAndPeriod = [],
  setArticlesByPlanAndPeriod,
  planSelected,
  selectedTab,
  apiBaseUrl = "",
  NL_PLANS = [],
  TooltipPeriod,
  navCommunity = { id: 9 }, // Provided as prop for Storybook/demo
  isNlSending = false,
  getCurrentPeriod,
  formatDate,
  formatEndDate,
  ...otherProps
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!article) return <Fetching />;

  const _ = (key) => I18N[language]?.[key] || key;
  const nameAttr = `name${language?.charAt(0).toUpperCase() + language?.slice(1)}`;
  const authorsWithEnableAvatar =
    article.author && article.author.length > 0
      ? article.author.filter((el) => el.enableAvatar === true)
      : [];
  const orgName = article.organization?.abbreviation || article.organization?.name || "";
  const isPublishedDateInRange =
    article.publishedAt &&
    startDate &&
    endDate &&
    new Date(article.publishedAt) >= new Date(startDate) &&
    new Date(article.publishedAt) <= new Date(endDate);

  const recipientsOrgs = article.nlRecipientsOrgs || [];
  const isArticleUsed = recipientsOrgs.includes(navCommunity?.id);

  const matchingKey = article.newsletterPeriods
    ? Object.keys(article.newsletterPeriods).find((key) => String(key) === String(navCommunity?.id))
    : null;
  const matchingObject = matchingKey ? article.newsletterPeriods[matchingKey] : null;
  const newsletterPeriods =
    matchingObject &&
    matchingObject
      .filter(
        (item) =>
          item.periodNumber !== periodNumber &&
          item.period === period &&
          item.year === year
      )
      .sort((a, b) => a.periodNumber - b.periodNumber);

  const isArticleProgrammed =
    article.isProgrammedNl === 1 && newsletterPeriods && newsletterPeriods.length > 0;

  const handleCheckboxChange = (plan) => {
    if (!setArticlesByPlanAndPeriod) return;
    const periodC = getPeriodConfig(plan.value);
    const existingEntryIndex = articlesByPlanAndPeriod.findIndex(
      (entry) => entry.plan === plan.value && entry.periodConfig === periodC
    );
    setArticlesByPlanAndPeriod((prevState) => {
      let periodInfo;
      if (typeof getCurrentPeriod === "function") {
        periodInfo = getCurrentPeriod(
          year,
          month,
          new Date(year, month, 0).getDate(),
          plan.value === "PERSONALIZED" || plan.value === "STANDARD" ? "WEEK" : "TWO_WEEKS"
        );
      } else {
        periodInfo = [null, new Date(), new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)];
      }
      if (existingEntryIndex !== -1) {
        return prevState.map((entry, idx) => {
          if (idx === existingEntryIndex) {
            const alreadyIncluded = entry.articleIds.includes(article.id);
            return {
              ...entry,
              articleIds: alreadyIncluded
                ? entry.articleIds.filter((id) => id !== article.id)
                : [...entry.articleIds, article.id],
              isEdited: plan.value !== planSelected?.value,
              startDate: typeof formatDate === "function" ? formatDate(periodInfo[1]) : periodInfo[1].toISOString(),
              endDate: typeof formatEndDate === "function" ? formatEndDate(periodInfo[2]) : periodInfo[2].toISOString(),
            };
          }
          return entry;
        });
      } else {
        return [
          ...prevState,
          {
            plan: plan.value,
            periodConfig: periodC,
            articleIds: [article.id],
            isEdited: plan.value !== planSelected?.value,
            startDate: typeof formatDate === "function" ? formatDate(periodInfo[1]) : periodInfo[1].toISOString(),
            endDate: typeof formatEndDate === "function" ? formatEndDate(periodInfo[2]) : periodInfo[2].toISOString(),
          },
        ];
      }
    });
  };

  const getPeriodConfig = (plan) => {
    const currentDate = new Date();
    if (plan === "PERSONALIZED" || plan === "STANDARD") {
      if (period === "WEEK") {
        return periodConfig;
      } else if (typeof getCurrentPeriod === "function") {
        let result = getCurrentPeriod(year, month, new Date(year, month, 0).getDate(), "WEEK");
        return result.length > 0 ? result[0] : "W1";
      } else {
        return "W1";
      }
    }
    if (plan === "LITE" && period === "WEEK") {
      const dayOfMonth = currentDate.getDate();
      if (dayOfMonth >= 1 && dayOfMonth <= 14) return "TW1";
      if (dayOfMonth >= 15) return "TW2";
    }
    return periodConfig;
  };

  const isPlanChecked = (planValue) => {
    if (!articlesByPlanAndPeriod) return false;
    const planPeriodConfig = getPeriodConfig(planValue);
    const associatedPeriods = { TW1: ["W1", "W2"], TW2: ["W3", "W4", "W5"] };
    const additionalPeriods = associatedPeriods[periodConfig] || [];
    return (
      articlesByPlanAndPeriod?.some((entry) => {
        if (entry.plan === planValue) {
          return (
            (entry.periodConfig === planPeriodConfig && entry.articleIds.includes(article.id)) ||
            (additionalPeriods.includes(entry.periodConfig) && entry.articleIds.includes(article.id))
          );
        }
        return false;
      }) || false
    );
  };

  return (
    <div className={`${styles.article_container} cell small-6`} style={style} {...otherProps}>
      <div
        className={classNames(
          styles.article,
          articles && !isVisible ? styles.hover_effect : "",
          inAccordion ? styles.article_accordion : "",
          articles && articles.map((el) => el.id).includes(article.id) ? styles.selected : "",
          index > 7 && styles.article_overlay
        )}
      >
        {inAccordion && (
          <div className={styles.dragHandler}>
            <img alt="" src="/img/icons/drag.svg" width="7" />
          </div>
        )}

        {listeners && (
          <div
            className={styles.dragHandler}
            onMouseDown={(e) => e.stopPropagation()}
            {...listeners}
            {...attributes}
          >
            <img alt="" src="/img/icons/drag.svg" width="10" />
          </div>
        )}
        <div
          className={styles.img}
          style={{
            backgroundImage: article.main_media
              ? `url(${
                  article.main_media.fullMediaUrl
                    ? article.main_media.fullMediaUrl
                    : apiBaseUrl + "/" + article.main_media.webPath
                })`
              : "",
          }}
        >
          {isPublishedDateInRange && (
            <div className="notification-wrapper">
              <div className={styles.notification}>
                <span>{_("for_period")}</span>
                <img src="/img/icons/calendar.svg" width="17" />
              </div>
            </div>
          )}
          {article.organization?.avatarUrl && (
            <img
              className={styles.articleClientAvatar}
              src={article.organization.avatarUrl}
              alt="Client Avatar"
            />
          )}
          {(isArticleUsed || isArticleProgrammed) && (
            <div
              className={classNames(
                styles.tag_article,
                isArticleUsed
                  ? styles.used_article
                  : isArticleProgrammed
                  ? styles.programmed_article
                  : ""
              )}
            >
              {isArticleUsed ? (
                <>
                  <img src="/img/icons/send.svg" width="12" />
                  <span>{_("is_used")}</span>
                </>
              ) : (
                isArticleProgrammed && (
                  <>
                    <img src="/img/icons/checkSquare.svg" width="12" />
                    <span>{_("is_programmed")}</span>
                  </>
                )
              )}
            </div>
          )}
          <div className={styles.tag_periods}>
            {newsletterPeriods &&
              newsletterPeriods.map((obj, idx) => (
                <span key={idx}>
                  {obj.period === "WEEK"
                    ? _("week")
                    : obj.period === "TWO_WEEKS"
                    ? _("two_weeks")
                    : obj.period === "MONTH" && _("month")}
                  {" " + obj.periodNumber}{" "}
                </span>
              ))}
          </div>
        </div>

        {inAccordion && !isPassed && (
          <div
            className={styles.close}
            onClick={() => {
              if (handleRemoveArticle) {
                handleRemoveArticle(articles, setArticles, periodConfig, article);
              }
              if (setIsEdit) setIsEdit(true);
            }}
          >
            <i className="icon-ttp-close"></i>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.authors}>
            {authorsWithEnableAvatar && authorsWithEnableAvatar.length > 0 ? (
              authorsWithEnableAvatar.map((item, idx) => (
                <div className={styles.author} key={`author-${idx}`}>
                  {!inAccordion && (
                    <div
                      className={styles.author_img}
                      style={{
                        backgroundImage: `url(${
                          item.avatarUrl
                            ? item.avatarUrl
                            : apiBaseUrl + "/" + item.avatar
                        })`,
                      }}
                    ></div>
                  )}
                  <div className={styles.info}>
                    <div className={styles.name}>{`${item.firstName}  ${item.lastName}`}</div>
                    <div className={styles.date}>
                      {moment(article.publishedAt, API_DATE_FORMAT)
                        .locale(language)
                        .format("DD MMMM, " + _("à") + " HH:mm")}
                    </div>
                  </div>
                </div>
              ))
            ) : article.chains && article.chains.length > 0 ? (
              article.chains.map((chain, idx) => {
                const mediaChainSelected = chain.mediaChain?.find((el) => el.language === language);
                return (
                  <div className={styles.author} key={`chain-${idx}`}>
                    {!inAccordion && mediaChainSelected && (
                      <div
                        className={styles.author_img}
                        style={{
                          backgroundImage: `url(${
                            mediaChainSelected.avatarUrl
                              ? mediaChainSelected.avatarUrl
                              : apiBaseUrl + "/" + mediaChainSelected.avatar
                          })`,
                        }}
                      ></div>
                    )}
                    {mediaChainSelected && (
                      <div className={styles.info}>
                        <div className={styles.name}>{chain[nameAttr]}</div>
                        <div className={styles.date}>
                          {moment(article.publishedAt, API_DATE_FORMAT)
                            .locale(language)
                            .format("DD MMMM, " + _("à") + " HH:mm")}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={styles.date}>
                {moment(article.publishedAt, API_DATE_FORMAT)
                  .locale(language)
                  .format("DD MMMM, " + _("à") + " HH:mm")}
              </div>
            )}
          </div>
          <div className={styles.title}>
            {article.title?.length <= 70
              ? article.title
              : `${article.title?.substring(0, 70)}...`}
            {article.title?.length > 70 && (
              <span className={styles.tooltip_text}>{article.title}</span>
            )}
          </div>
          {!inAccordion && (
            <a
              href={`/${language}/article/${article.url}/${article.id}`}
              target="_blank"
              rel="noreferrer"
              className={styles.read_more}
            >
              {_("read_more")}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.60686 4.64308L3.1099 0.147619C2.91258 -0.0492063 2.59288 -0.0492063 2.39506 0.147619C2.19774 0.344444 2.19774 0.664139 2.39506 0.860964L6.53532 4.99973L2.39556 9.1385C2.19824 9.33532 2.19824 9.65502 2.39556 9.85234C2.59288 10.0492 2.91308 10.0492 3.1104 9.85234L7.60736 5.35688C7.80169 5.16209 7.80169 4.83737 7.60686 4.64308Z"
                  fill="#6D7F92"
                />
              </svg>
            </a>
          )}
        </div>
        <div
          className={styles.category}
          style={{ backgroundColor: article.category?.colorCode }}
        >
          {article.category[nameAttr]}
        </div>
        {!inAccordion && (
          <>
            {articles && !isPassed && (
              <>
                <div
                  className={classNames(
                    styles.icon,
                    isVisible ? styles.icon_selected : ""
                  )}
                  onClick={() => {
                    if (articles.map((el) => el.id).includes(article.id)) {
                      // Already selected
                    } else {
                      if (nbArticles < 32) {
                        if (setArticles) setArticles([article, ...articles]);
                        if (planSelected) handleCheckboxChange(planSelected);
                        if (setIsEdit) setIsEdit(true);
                      } else {
                        toast.warning(_("Vous n'avez pas le droit d'ajouter plus d'articles"), {
                          autoClose: 2500,
                        });
                      }
                    }
                  }}
                >
                  <div className={styles.other}>
                    <i className="icon-ttp-plus" style={{ lineHeight: "4" }}></i>
                  </div>
                </div>
                <div
                  className={styles.close}
                  onClick={() => {
                    if (setArticles) {
                      setArticles(articles.filter((item) => item.id !== article.id));
                    }
                    if (setIsEdit) setIsEdit(true);
                  }}
                >
                  <i className="icon-ttp-close"></i>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <div className={styles.plan_block}>
        {checkedPlans && navCommunity?.id === 9 && NL_PLANS && (
          <>
            <span className={styles.plan_label}>{_("use_for_plan")} :</span>
            {NL_PLANS.map((plan) => (
              <div className={classNames(styles.plan_value)} key={plan.label}>
                <input
                  type="checkbox"
                  id={`${article.id}-${plan.label}`}
                  name="plan"
                  value={plan.label}
                  checked={isPlanChecked(plan.value)}
                  onChange={() => {
                    const wasChecked = isPlanChecked(plan.value);
                    handleCheckboxChange(plan);
                    if (
                      wasChecked &&
                      plan.value === planSelected?.value
                    ) {
                      if (setArticles) {
                        setArticles(articles.filter((item) => item.id !== article.id));
                      }
                      if (setIsEdit) setIsEdit(true);
                    }
                  }}
                />
                <label htmlFor={`${article.id}-${plan.label}`}>{plan.label}</label>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterArticle;