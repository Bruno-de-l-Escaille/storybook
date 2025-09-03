"use client";

import classNames from "classnames";
import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
// import { Pagination } from "swiper";
// import { Swiper, SwiperClass, SwiperProps, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";
// import "swiper/css/pagination";
import { ReactComponent as ArrowRight } from "../assets/arrow-right.svg";
import styles from "./ttp-slider.module.scss";
import { useResponsive } from "../../../hooks/useResponsive";

export default function TTPSlider({
  cards, // custom props
  theme = "blue",
  title,
  subtitle,
  isAuto,
  rightOverflow,
  className,
  slidesPerView = 3, // swiper props
  slidesPerGroup = slidesPerView,
  centeredSlides = false,
  loop = true,
  ...swiperProps
}) {
  const { isMobile, isTablet } = useResponsive();

  const [swiper, setSwiper] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [nbrOfSlidesPerView, setNbrOfSlidesPerView] = useState(slidesPerView);
  const [nbrOfSlidesPerGroup, setNbrOfSlidesPerGroup] = useState(
    slidesPerGroup
  );
  const [totalCards, setTotalCards] = useState(
    cards?.length - (rightOverflow ? 1 : 0)
  );
  const [totalSlides, setTotalSlides] = useState(0);
  const [showActions, setShowActions] = useState(true);

  const [updateSwiper, setUpdateSwiper] = useState("update1");

  useEffect(() => {
    if (isTablet && nbrOfSlidesPerView !== 2) {
      setNbrOfSlidesPerView(2);
      setNbrOfSlidesPerGroup(2);
      setUpdateSwiper(
        (prev) => prev.split(/\d/)[0] + Number(prev.slice(-1) + 1)
      );
    }
    if (isMobile && nbrOfSlidesPerView !== 1) {
      setNbrOfSlidesPerView(1);
      setNbrOfSlidesPerGroup(1);
      setUpdateSwiper(
        (prev) => prev.split(/\d/)[0] + Number(prev.slice(-1) + 1)
      );
    }
    if (!isMobile && !isTablet && nbrOfSlidesPerView !== slidesPerView) {
      setNbrOfSlidesPerView(slidesPerView);
      setNbrOfSlidesPerGroup(slidesPerGroup);
      setUpdateSwiper(
        (prev) => prev.split(/\d/)[0] + Number(prev.slice(-1) + 1)
      );
    }
  }, [isMobile, isTablet, slidesPerView, slidesPerGroup]);

  useEffect(() => {
    const totCards = isMobile
      ? cards?.length
      : cards?.length - (rightOverflow ? 1 : 0);
    setTotalCards(totCards);
  }, [cards, rightOverflow, isMobile]);

  useEffect(() => {
    const slidesTotal =
      Math.ceil(totalCards / nbrOfSlidesPerGroup) -
      Math.ceil(
        (nbrOfSlidesPerView - nbrOfSlidesPerGroup) / nbrOfSlidesPerGroup
      );

    setTotalSlides(slidesTotal);
    const bool = slidesTotal > 1;
    setShowActions(bool);
    if (!bool && swiper && swiper.allowSlideNext) {
      setShowActions(true);
      if (cards.length > nbrOfSlidesPerView) {
        setTotalSlides(totalSlides + 1);
      }
    }
  }, [
    nbrOfSlidesPerView,
    nbrOfSlidesPerGroup,
    totalCards,
    swiper,
    cards.length,
    totalSlides,
  ]);

  const handleGoTo = (index) => {
    swiper.slideTo(index * nbrOfSlidesPerGroup);
  };

  const handlePrevClick = () => {
    swiper.slidePrev();
  };
  const handleNextClick = () => {
    if (!swiper || !swiper.el || !swiper.$wrapperEl) {
      console.warn("Swiper not ready yet", swiper);
      return;
    }

    if (!swiper.wrapperEl && swiper.$wrapperEl[0]) {
      swiper.wrapperEl = swiper.$wrapperEl[0];
    }
    // swiper.allowSlideNext = true;
    // swiper.isLocked = false;
    // swiper.slideNext();
    swiper.update();
    // if (swiper.isLocked) {
    //   console.warn("Swiper is locked, cannot slide");
    //   return;
    // }

    swiper.slideNext();
  };

  const handleSlideChange = (s) => {
    if (!swiper || !swiper.slidePrev) return;
    setSlideIndex(s.realIndex);
  };

  const renderHeader = () => {
    const renderTitles = () => (
      <div className={styles.titles}>
        <span className={styles.titles_title}>{title}</span>
        {subtitle}
      </div>
    );

    const renderActions = () => {
      if (!showActions) {
        return null;
      }
      return (
        <div className={styles.actions}>
          {!isTablet && (
            <div className={classNames(styles.dots, styles[theme])}>
              {totalSlides > 0 &&
                [...Array(totalSlides)]?.map((value, index) => (
                  <span
                    onClick={() => handleGoTo(index)}
                    className={classNames(
                      index === Math.ceil(slideIndex / nbrOfSlidesPerGroup) &&
                        styles.active
                    )}
                  />
                ))}
            </div>
          )}
          <div
            className={classNames(
              styles.button,
              styles.reverse,
              slideIndex === 0 && styles.disabled
            )}
            onClick={() => {
              return slideIndex !== 0 && handlePrevClick();
            }}
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

  const swiperStyle = {
    width: "100%",
    maxWidth: "100%",
    maxHeight: "100vh",
    minHeight: "0",
    minWidth: "0",
    // CSS Grid/Flexbox bug size workaround

    ...(rightOverflow && !isMobile && !isTablet
      ? {
          width: `calc(${rightOverflow}px + 100%)`,
          maxWidth: `calc(${rightOverflow}px + 100%)`,
          marginLeft: "0",
        }
      : {}),
  };

  const handleSwiperInit = (s) => {
    if (!s.wrapperEl && s.$wrapperEl && s.$wrapperEl[0]) {
      s.wrapperEl = s.$wrapperEl[0];
    }
    setSwiper(s);
  };
  return (
    <div className={classNames(styles.ttp_slider, className)}>
      {renderHeader()}
      <Swiper
        className={classNames(styles.swiperWrapper, styles[theme])}
        slidesPerView={!isAuto && !isMobile ? nbrOfSlidesPerView : "auto"}
        slidesPerGroup={nbrOfSlidesPerGroup}
        loop={loop}
        // navigation
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        onSlideChange={handleSlideChange}
        modules={[Pagination, Navigation, Scrollbar]}
        onSwiper={(s) => {
          if (!s.wrapperEl && s.$wrapperEl?.[0]) {
            s.wrapperEl = s.$wrapperEl[0]; // sécurité
          }
          setSwiper(s);
        }}
      >
        {centeredSlides && isMobile
          ? cards
              .reverse()
              .map((card, index) => (
                <SwiperSlide key={index}>{card}</SwiperSlide>
              ))
          : cards.map((card, index) => (
              <SwiperSlide key={index}>{card}</SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
