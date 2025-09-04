"use client";

import classNames from "classnames";
import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Swiper, SwiperClass, SwiperProps, SwiperSlide } from "swiper/react";
import { ReactComponent as ArrowRight } from "../assets/arrow-right.svg";
import { ReactComponent as ChevronRight } from "../assets/chevron-right.svg";
import { ReactComponent as ChevronIcon } from "../assets/chevron-up.svg";
import styles from "./ttp-slider.module.scss";
import { useResponsive } from "../../../hooks/useResponsive";

export default function TTPSlider1({
  cards, // custom props
  theme = "blue",
  title,
  subtitle,
  isAuto,
  rightOverflow,
  className,
  slidesPerView = 3, // swiper props
  slidesPerGroup = slidesPerView,
  seeAllLink,
  isOtherInterests,
  ...swiperProps
}) {
  const [swiper, setSwiper] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [nbrOfCardsToDisplay, setNbrOfCardsToDisplay] = useState(3);
  const [moreDetailsPosY, setMoreDetailsPosY] = useState(null);
  const moreDetailsRef = useRef(null);
  const { isMobile, isTablet } = useResponsive();
  const translate = (value) => {
    return value;
  };

  const totalCards = cards?.length - (rightOverflow ? 1 : 0);
  let totalSlides =
    Math.ceil(totalCards / slidesPerGroup) -
    Math.ceil((slidesPerView - slidesPerGroup) / slidesPerGroup);

  let showActions = totalSlides > 1;
  if (!showActions && swiper?.allowSlideNext) {
    showActions = true;
    if (cards?.length > slidesPerView) {
      totalSlides += 1;
    }
  }

  useEffect(() => {
    if (isMobile && moreDetailsRef.current) {
      const moreDetailsElement = moreDetailsRef?.current;
      const y = moreDetailsElement?.getBoundingClientRect().top;
      setMoreDetailsPosY(y - 300);
    }
  }, [moreDetailsRef, isMobile]);

  const handleGoTo = (index) => {
    swiper.slideTo(index * slidesPerGroup);
  };

  const handlePrevClick = () => {
    swiper.slidePrev();
  };

  const handleNextClick = () => {
    swiper.slideNext();
  };

  const handleSeeMore = () => {
    if (nbrOfCardsToDisplay < cards.length) {
      setNbrOfCardsToDisplay(nbrOfCardsToDisplay + 4);
    } else {
      setNbrOfCardsToDisplay(3);
      moreDetailsPosY && window.scrollTo(0, moreDetailsPosY);
    }
  };

  const handleSlideChange = (s) => {
    setSlideIndex(s.realIndex);
  };

  const renderHeader = () => {
    const renderTitles = () => (
      <div className={styles.titleContainer}>
        <div className={styles.titles}>
          <span className={styles.titles_title}>
            {title}
            {seeAllLink && (
              <a className={styles.seeAllButton} href={seeAllLink}>
                <div>{translate("common.seeAll")}</div>
                <ChevronRight fill="#6d7f92" />
              </a>
            )}
          </span>
          {subtitle}
        </div>
      </div>
    );

    const renderActions = () => {
      if (!showActions) {
        return null;
      }
      return (
        <div
          className={classNames(
            styles.actions,
            isOtherInterests ? "p-r-xl" : ""
          )}
        >
          {!isTablet && (
            <div className={classNames(styles.dots, styles[theme])}>
              {[...Array(totalSlides)]?.map((value, index) => (
                <span
                  onClick={() => handleGoTo(index)}
                  className={classNames(
                    index === Math.ceil(slideIndex / slidesPerGroup) &&
                      styles.active
                  )}
                />
              ))}
            </div>
          )}
          <div
            className={classNames(
              styles.button,
              "rl180",
              slideIndex === 0 && styles.disabled
            )}
            onClick={() => slideIndex !== 0 && handlePrevClick()}
          >
            <ArrowRight />
          </div>
          <div
            className={classNames(styles.button)}
            onClick={() => handleNextClick()}
          >
            <ArrowRight />
          </div>
        </div>
      );
    };

    return (
      <div className={styles.header}>
        {renderTitles()}
        {!isMobile && renderActions()}
      </div>
    );
  };

  const swiperStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100vh",
    minHeight: "0",
    minWidth: "0",
    // CSS Grid/Flexbox bug size workaround

    ...(rightOverflow
      ? {
          width: `calc(${rightOverflow}px + 100%)`,
          maxWidth: `calc(${rightOverflow}px + 100%)`,
          marginLeft: "0",
        }
      : {}),
  };

  return (
    <div className={classNames(styles.ttp_slider_1, className)}>
      {renderHeader()}
      <Swiper
        style={swiperStyle}
        wrapperClass={styles.swiperWrapper}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        slidesPerView={!isAuto ? slidesPerView : "auto"}
        slidesPerGroup={slidesPerGroup}
        allowSlideNext={!isMobile}
        allowSlidePrev={!isMobile}
        touchStartPreventDefault={false}
        preventClicks={false}
        simulateTouch={false}
        {...swiperProps}
      >
        {cards.map((card, index) => (
          <>
            {(index <= nbrOfCardsToDisplay - 1 || !isMobile) && (
              <SwiperSlide key={index}>{card}</SwiperSlide>
            )}
          </>
        ))}
      </Swiper>
      {isMobile && cards.length > 4 && (
        <div className={styles.seeMoreButton}>
          <button onClick={handleSeeMore} ref={moreDetailsRef}>
            <span>
              {translate(
                nbrOfCardsToDisplay < cards.length
                  ? "inscription.see_more"
                  : "inscription.see_less"
              )}
            </span>
            <ChevronIcon
              style={{
                transform:
                  nbrOfCardsToDisplay >= cards.length ? "" : "rotate(180deg)",
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
}
